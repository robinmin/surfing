/**
 * Git Manager for PostSurfing CLI
 *
 * Handles git operations including commit and push
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export class GitManager {
    constructor(logger) {
        this.logger = logger;
        this.projectRoot = process.cwd();
    }

    /**
     * Commit and push changes
     */
    async commitAndPush(commitMessage, filePath) {
        this.logger.debug('Starting git operations');

        // Check if we're in a git repository
        if (!this.isGitRepository()) {
            this.logger.warn('Not in a git repository, skipping git operations');
            return { success: true, skipped: true };
        }

        try {
            // Check git status
            const status = await this.getGitStatus();
            if (!status.hasChanges) {
                this.logger.info('No changes to commit');
                return { success: true, noChanges: true };
            }

            // Add the specific file
            await this.addFile(filePath);

            // Commit changes
            const commitResult = await this.commit(commitMessage);
            if (!commitResult.success) {
                return commitResult;
            }

            // Push changes
            const pushResult = await this.push();
            return pushResult;
        } catch (error) {
            this.logger.error(`Git operation failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Check if current directory is a git repository
     */
    isGitRepository() {
        return existsSync(join(this.projectRoot, '.git'));
    }

    /**
     * Get git status
     */
    async getGitStatus() {
        const result = await this.runGitCommand(['status', '--porcelain']);

        if (!result.success) {
            throw new Error(`Failed to get git status: ${result.error}`);
        }

        const hasChanges = result.output.trim().length > 0;
        const changes = result.output
            .trim()
            .split('\n')
            .filter((line) => line.length > 0);

        return { hasChanges, changes };
    }

    /**
     * Add file to git staging
     */
    async addFile(filePath) {
        this.logger.debug(`Adding file to git: ${filePath}`);

        const result = await this.runGitCommand(['add', filePath]);

        if (!result.success) {
            throw new Error(`Failed to add file: ${result.error}`);
        }

        this.logger.gitOperation('add', result);
        return result;
    }

    /**
     * Commit changes
     */
    async commit(message) {
        this.logger.debug(`Committing with message: ${message}`);

        const result = await this.runGitCommand(['commit', '-m', message]);

        if (!result.success) {
            // Check if it's because there's nothing to commit
            if (
                result.output.includes('nothing to commit') ||
                result.output.includes('no changes added to commit') ||
                result.error.includes('nothing to commit')
            ) {
                this.logger.infoVerbose('Nothing to commit - no changes detected');
                return { success: true, noChanges: true };
            }

            this.logger.debug(`Commit failed with output: ${result.output}`);
            this.logger.debug(`Commit failed with error: ${result.error}`);
            throw new Error(`Failed to commit: ${result.error}`);
        }

        this.logger.gitOperation('commit', result);
        return result;
    }

    /**
     * Push changes to remote
     */
    async push() {
        this.logger.debug('Pushing to remote repository');

        // First, check if we have a remote
        const remoteResult = await this.runGitCommand(['remote']);
        if (!remoteResult.success || !remoteResult.output.trim()) {
            this.logger.warn('No git remote configured, skipping push');
            return { success: true, skipped: true, reason: 'no_remote' };
        }

        // Get current branch
        const branchResult = await this.runGitCommand(['branch', '--show-current']);
        if (!branchResult.success) {
            throw new Error(`Failed to get current branch: ${branchResult.error}`);
        }

        const currentBranch = branchResult.output.trim();
        this.logger.debug(`Current branch: ${currentBranch}`);

        // Push to remote
        const result = await this.runGitCommand(['push', 'origin', currentBranch]);

        if (!result.success) {
            // Check for common push issues
            if (result.output.includes('rejected')) {
                throw new Error(
                    `Push rejected. You may need to pull changes first: git pull origin ${currentBranch}`
                );
            } else if (result.output.includes('authentication')) {
                throw new Error('Authentication failed. Check your git credentials.');
            } else if (result.output.includes('permission denied')) {
                throw new Error('Permission denied. Check your repository access rights.');
            } else {
                throw new Error(`Failed to push: ${result.error}`);
            }
        }

        this.logger.gitOperation('push', result);
        return result;
    }

    /**
     * Run a git command
     */
    async runGitCommand(args) {
        return new Promise((resolve) => {
            this.logger.debug(`Running git command: git ${args.join(' ')}`);

            const gitProcess = spawn('git', args, {
                cwd: this.projectRoot,
                stdio: 'pipe',
                shell: false, // Changed from true to false to prevent shell interpretation
            });

            let stdout = '';
            let stderr = '';

            gitProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            gitProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            gitProcess.on('close', (code) => {
                const output = stdout + stderr;

                if (code === 0) {
                    resolve({ success: true, output: stdout, error: stderr });
                } else {
                    resolve({
                        success: false,
                        output,
                        error: stderr || `Git command failed with exit code ${code}`,
                    });
                }
            });

            gitProcess.on('error', (error) => {
                resolve({
                    success: false,
                    output: '',
                    error: `Failed to run git command: ${error.message}`,
                });
            });
        });
    }

    /**
     * Check if there are uncommitted changes
     */
    async hasUncommittedChanges() {
        const status = await this.getGitStatus();
        return status.hasChanges;
    }

    /**
     * Get current branch name
     */
    async getCurrentBranch() {
        const result = await this.runGitCommand(['branch', '--show-current']);
        if (result.success) {
            return result.output.trim();
        }
        return null;
    }

    /**
     * Check if remote repository exists
     */
    async hasRemote() {
        const result = await this.runGitCommand(['remote']);
        return result.success && result.output.trim().length > 0;
    }

    /**
     * Get git repository information
     */
    async getRepositoryInfo() {
        const info = {
            isRepository: this.isGitRepository(),
            currentBranch: null,
            hasRemote: false,
            hasUncommittedChanges: false,
            remotes: [],
        };

        if (!info.isRepository) {
            return info;
        }

        try {
            // Get current branch
            info.currentBranch = await this.getCurrentBranch();

            // Check for remotes
            const remoteResult = await this.runGitCommand(['remote', '-v']);
            if (remoteResult.success) {
                info.hasRemote = remoteResult.output.trim().length > 0;
                info.remotes = remoteResult.output
                    .trim()
                    .split('\n')
                    .filter((line) => line.length > 0)
                    .map((line) => {
                        const parts = line.split('\t');
                        return { name: parts[0], url: parts[1] };
                    });
            }

            // Check for uncommitted changes
            info.hasUncommittedChanges = await this.hasUncommittedChanges();
        } catch (error) {
            this.logger.debug(`Error getting repository info: ${error.message}`);
        }

        return info;
    }

    /**
     * Display repository information
     */
    async displayRepositoryInfo() {
        const info = await this.getRepositoryInfo();

        this.logger.info('Git Repository Information:');
        this.logger.table({
            'Is Git Repository': info.isRepository ? 'Yes' : 'No',
            'Current Branch': info.currentBranch || 'N/A',
            'Has Remote': info.hasRemote ? 'Yes' : 'No',
            'Uncommitted Changes': info.hasUncommittedChanges ? 'Yes' : 'No',
        });

        if (info.remotes.length > 0) {
            this.logger.list(
                info.remotes.map((remote) => `${remote.name}: ${remote.url}`),
                'Remotes'
            );
        }

        return info;
    }

    /**
     * Validate git setup before operations
     */
    async validateGitSetup() {
        const issues = [];
        const warnings = [];

        // Check if git is available
        const gitVersionResult = await this.runGitCommand(['--version']);
        if (!gitVersionResult.success) {
            issues.push('Git is not installed or not available in PATH');
            return { valid: false, issues, warnings };
        }

        // Check if we're in a git repository
        if (!this.isGitRepository()) {
            issues.push('Current directory is not a git repository');
            return { valid: false, issues, warnings };
        }

        // Check git configuration
        const userNameResult = await this.runGitCommand(['config', 'user.name']);
        if (!userNameResult.success || !userNameResult.output.trim()) {
            warnings.push('Git user.name is not configured');
        }

        const userEmailResult = await this.runGitCommand(['config', 'user.email']);
        if (!userEmailResult.success || !userEmailResult.output.trim()) {
            warnings.push('Git user.email is not configured');
        }

        // Check for remote
        const hasRemote = await this.hasRemote();
        if (!hasRemote) {
            warnings.push('No git remote configured - push will be skipped');
        }

        return {
            valid: issues.length === 0,
            issues,
            warnings,
        };
    }
}
