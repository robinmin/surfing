import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LoadingManager,
    createDebouncedLoading,
    createLoadingManager,
    createThresholdLoading,
    simulateProgress,
} from '~/lib/loading';

describe('loading manager', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
    });

    it('tracks state transitions, listeners, and resets', () => {
        const manager = new LoadingManager();
        const listener = vi.fn();
        const failingListener = vi.fn(() => {
            throw new Error('listener failed');
        });
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const unsubscribe = manager.addListener(listener);
        manager.addListener(failingListener);

        manager.start({ type: 'signing-in', provider: 'google', message: 'Working', timeout: 1000 });
        expect(manager.isLoading()).toBe(true);
        expect(manager.getState()).toMatchObject({
            isLoading: true,
            type: 'signing-in',
            provider: 'google',
            message: 'Working',
            progress: 0,
        });

        manager.updateProgress(130);
        expect(manager.getState().progress).toBe(100);
        manager.updateMessage('Updated');
        manager.updateType('validating');

        unsubscribe();
        manager.removeListener(failingListener);
        manager.reset();

        expect(listener).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledWith('Loading state listener error:', expect.any(Error));
        expect(manager.getState()).toMatchObject({
            isLoading: false,
            type: 'loading',
            provider: 'general',
            progress: 0,
        });
    });

    it('stops automatically on timeout and reports duration', () => {
        const manager = createLoadingManager({ type: 'initializing' });
        manager.start({ timeout: 500 });
        manager.start({ timeout: 500 });

        vi.advanceTimersByTime(499);
        expect(manager.isLoading()).toBe(true);
        vi.advanceTimersByTime(1);
        expect(manager.isLoading()).toBe(false);
        expect(manager.getDuration()).toBeGreaterThanOrEqual(500);
    });

    it('wraps async work with loading state and minimum duration enforcement', async () => {
        const manager = new LoadingManager();
        const resultPromise = manager.executeWithLoading(
            async () => {
                vi.advanceTimersByTime(10);
                return 'ok';
            },
            { minDuration: 100, type: 'loading' }
        );

        await vi.runAllTimersAsync();
        await expect(resultPromise).resolves.toBe('ok');
        expect(manager.isLoading()).toBe(false);
    });

    it('propagates errors and invokes the optional error handler', async () => {
        const manager = new LoadingManager();
        const errorHandler = vi.fn();
        const failure = new Error('boom');

        const resultPromise = manager.executeWithLoading(
            async () => {
                throw failure;
            },
            { errorHandler }
        );

        await expect(resultPromise).rejects.toThrow('boom');
        expect(errorHandler).toHaveBeenCalledWith(failure);
        expect(manager.isLoading()).toBe(false);
    });

    it('surfaces timeout failures from executeWithLoading when the max timeout fires immediately', async () => {
        const manager = new LoadingManager();
        const originalSetTimeout = window.setTimeout;
        vi.spyOn(window, 'setTimeout').mockImplementation(((callback: TimerHandler, timeout?: number) => {
            if (timeout === 5 && typeof callback === 'function') {
                callback();
            }
            return originalSetTimeout(() => {}, 0);
        }) as typeof window.setTimeout);

        await expect(
            manager.executeWithLoading(
                () => new Promise<string>(() => {}),
                { maxDuration: 5 }
            )
        ).rejects.toThrow('Operation timed out after 5ms');
    });

    it('simulates progress and supports debounced loading', async () => {
        const manager = new LoadingManager();
        const debounced = createDebouncedLoading(manager, 300);
        const startSpy = vi.spyOn(manager, 'start');

        debounced.stop();
        debounced.start({ type: 'checking-session' });
        debounced.start({ type: 'checking-session' });
        vi.advanceTimersByTime(299);
        expect(manager.isLoading()).toBe(false);
        vi.advanceTimersByTime(1);
        expect(manager.isLoading()).toBe(true);
        debounced.start({ type: 'checking-session' });
        expect(startSpy).toHaveBeenCalledTimes(1);
        debounced.stop();
        expect(manager.isLoading()).toBe(false);

        const progressPromise = simulateProgress(manager, 1000, 4);
        await vi.runAllTimersAsync();
        await progressPromise;
        expect(manager.getState().progress).toBe(100);
    });

    it('supports threshold-based loading visibility and cleanup', async () => {
        const manager = new LoadingManager();
        const threshold = createThresholdLoading(manager, 200);

        threshold.stop();

        const startPromise = threshold.start({ type: 'loading' });
        vi.advanceTimersByTime(200);
        await startPromise;
        expect(manager.isLoading()).toBe(true);

        threshold.stop();
        vi.advanceTimersByTime(800);
        expect(manager.isLoading()).toBe(false);

        const secondStart = threshold.start({ type: 'loading' });
        vi.advanceTimersByTime(200);
        await secondStart;
        vi.advanceTimersByTime(900);
        threshold.stop();
        expect(manager.isLoading()).toBe(false);

        manager.destroy();
        expect(manager.getState().isLoading).toBe(false);
    });
});
