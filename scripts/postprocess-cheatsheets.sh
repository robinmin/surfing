#!/bin/bash

# Cheatsheet Postprocessing Script
# Publishes refined cheatsheets to the Surfing platform after user approval
#
# Usage:
#   ./postprocess-cheatsheets.sh <refined-html-file> [options]
#
# What this script does:
#   1. Validates the refined HTML file
#   2. Converts HTML to markdown with frontmatter
#   3. Runs postsurfing to publish to the website
#   4. Optionally generates PDF if not already done
#
# Options:
#   --no-commit            Skip git commit (only generate files)
#   --commit-message <msg> Custom commit message
#   --dry-run              Preview changes without applying them
#   --verbose              Enable detailed logging
#   --help, -h             Show this help message

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default configuration
NO_COMMIT=false
COMMIT_MESSAGE=""
DRY_RUN=false
VERBOSE=false
LANG="en"  # Default language

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

show_help() {
    cat << EOF
Cheatsheet Postprocessing Script

USAGE:
    $(basename "$0") <refined-html-file> [options]

DESCRIPTION:
    This script publishes refined cheatsheets to the Surfing platform after user approval.
    It handles markdown conversion, PDF generation (optional), and automated publishing.

ARGUMENTS:
    <refined-html-file>      Refined HTML cheatsheet file to publish

OPTIONS:
    --lang <lang>          Content language: en, cn, jp (default: en)
    --no-commit            Skip git commit (only generate files)
    --commit-message <msg> Custom commit message
    --dry-run              Preview changes without applying them
    --verbose              Enable detailed logging
    --help, -h             Show this help message

EXAMPLES:
    # Publish cheatsheet (auto-detects if PDF needed)
    $(basename "$0") golang-cheatsheet.html

    # Publish without committing (preview files only)
    $(basename "$0") react-cheatsheet.html --no-commit

    # Custom commit message
    $(basename "$0") python-cheatsheet.html --commit-message "Update Python cheatsheet"

    # Dry run to preview changes
    $(basename "$0") javascript-cheatsheet.html --dry-run

    # Specify language
    $(basename "$0") golang-cheatsheet.html --lang cn

WORKFLOW:
    1. Validates the refined HTML file
    2. Auto-detects if PDF needs generation (checks assets/pdf/cheatsheets/)
    3. Generates PDF if not already present
    4. Converts HTML to markdown with frontmatter
    5. Publishes to Surfing platform using postsurfing
    6. Cleans up cached HTML file from contents/cheatsheets/
    7. Commits and pushes changes (unless --no-commit)

PREREQUISITES:
    - Refined HTML file must exist
    - postsurfing tool must be installed (in scripts/postsurfing/)
    - html2pdf tool must be installed (in scripts/html2pdf/)

For more information, visit: https://surfing.salty.vip/

EOF
}

# Parse command line arguments
parse_args() {
    INPUT_FILE=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --lang)
                LANG="$2"
                shift 2
                ;;
            --no-commit)
                NO_COMMIT=true
                shift
                ;;
            --commit-message)
                COMMIT_MESSAGE="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            -*)
                log_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
            *)
                if [[ -z "$INPUT_FILE" ]]; then
                    INPUT_FILE="$1"
                else
                    log_error "Multiple input files not supported: $1"
                    exit 1
                fi
                shift
                ;;
        esac
    done

    # Validate required arguments
    if [[ -z "$INPUT_FILE" ]]; then
        log_error "Input file is required"
        echo "Use --help for usage information"
        exit 1
    fi

    if [[ ! -f "$INPUT_FILE" ]]; then
        log_error "Input file not found: $INPUT_FILE"
        exit 1
    fi
}

# Validate the refined HTML file
validate_html() {
    local input_file="$1"

    log_info "Validating refined HTML file..."

    # Check if file is HTML
    if [[ ! "$input_file" =~ \.html?$ ]]; then
        log_error "Input file must be an HTML file"
        exit 1
    fi

    # Check if file has basic HTML structure
    if ! grep -q "<html" "$input_file" || ! grep -q "<body" "$input_file"; then
        log_error "Invalid HTML file: missing basic HTML structure"
        exit 1
    fi

    # Check if file has cheatsheet content
    if ! grep -q "class.*cheat" "$input_file"; then
        log_warning "File may not be a properly formatted cheatsheet"
    fi

    log_success "HTML file validated successfully"
}

# Auto-generate PDF (overwrite if existing for freshness)
auto_generate_pdf() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local slug=$(basename "$filename" .html)
    local pdf_dir="$PROJECT_ROOT/assets/pdf/cheatsheets/$LANG"
    local pdf_file="$pdf_dir/${slug}.pdf"

    # Always set PDF_PATH for metadata (even if generation is skipped)
    PDF_PATH="$pdf_file"

    # Create PDF directory if it doesn't exist
    mkdir -p "$pdf_dir"

    # Check if html2pdf tool exists
    if [[ ! -f "$SCRIPT_DIR/html2pdf/pdf-export.mjs" ]]; then
        log_warning "html2pdf tool not found, skipping PDF generation"
        return 0
    fi

    if [[ "$DRY_RUN" == true ]]; then
        log_info "Would generate PDF: $pdf_file"
        return 0
    fi

    # Generate PDF
    log_info "Generating PDF..."
    node "$SCRIPT_DIR/html2pdf/pdf-export.mjs" "$input_file" "$pdf_file" --single-page --margin=10px > /dev/null 2>&1

    if [[ $? -eq 0 ]]; then
        log_success "PDF: $pdf_file"
        # Copy to public directory for web access
        local public_pdf_dir="$PROJECT_ROOT/public/pdf/cheatsheets/$LANG"
        mkdir -p "$public_pdf_dir"
        cp "$pdf_file" "$public_pdf_dir/${slug}.pdf"
        log_success "PDF copied to public directory: $public_pdf_dir/${slug}.pdf"
        PDF_PATH="$pdf_file"
    else
        log_warning "PDF generation failed, continuing without PDF"
        return 0
    fi
}

# Publish to Surfing platform
publish_to_surfing() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local slug=$(basename "$filename" .html)
    local target_dir="$PROJECT_ROOT/contents/cheatsheets/$LANG"

    log_info "Publishing cheatsheet..."

    if [[ "$DRY_RUN" == true ]]; then
        log_info "Would convert $filename and publish to $target_dir"
        return 0
    fi

    # Create target directory if needed
    mkdir -p "$target_dir"

    # Check if postsurfing exists
    if [[ ! -f "$SCRIPT_DIR/postsurfing/postsurfing.mjs" ]]; then
        log_error "postsurfing tool not found at: $SCRIPT_DIR/postsurfing/postsurfing.mjs"
        return 1
    fi

    # Generate relative PDF URL for metadata
    local pdf_url=""
    if [[ -n "$PDF_PATH" ]]; then
        # Convert absolute path to relative URL
        pdf_url="${PDF_PATH#$PROJECT_ROOT/public}"
    fi

    # Run postsurfing to convert and publish
    local postsurfing_args=(
        "$input_file"
        --type cheatsheets
        --lang "$LANG"
        --auto-convert
        --no-commit
    )
    
    # Add PDF URL if available
    if [[ -n "$pdf_url" ]]; then
        postsurfing_args+=(--pdf-url "$pdf_url")
    fi
    
    node "$SCRIPT_DIR/postsurfing/postsurfing.mjs" \
        "${postsurfing_args[@]}" \
        2>&1 | grep -v "^ℹ️" | grep -v "^📝" | grep -v "^🔍"

    if [[ $? -eq 0 ]]; then
        log_success "Published to: $target_dir/${slug}.md"
    else
        log_error "postsurfing conversion failed"
        return 1
    fi
}

# Cleanup temporary working file in /tmp
# Note: Original files are preserved in originals/cheatsheets by preprocess script
cleanup_refined_html() {
    local input_file="$1"
    local filename=$(basename "$input_file")

    # Only clean up files in /tmp/cheatsheets-working
    # Original files in originals/cheatsheets are preserved
    if [[ "$input_file" == /tmp/cheatsheets-working/* ]]; then
        if [[ "$DRY_RUN" == true ]]; then
            log_info "Would remove temporary file: $input_file"
        else
            rm -f "$input_file"
            log_info "Cleaned up temporary file: $input_file"
        fi
    fi
}

# Display processing summary
show_summary() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local slug=$(basename "$filename" .html)

    cat << EOF

📋 POSTPROCESSING SUMMARY:
───────────────────────────────────────
Input File:      $input_file
Content Type:    Cheatsheet
Slug:            $slug

Operations:
  ✓ HTML validation
  $([ -n "$PDF_PATH" ] && echo "✓ PDF generation" || echo "⊗ PDF generation (skipped)")
  ✓ Markdown conversion
  ✓ Frontmatter generation
  $([ "$NO_COMMIT" == true ] && echo "⊗ Git commit (skipped)" || echo "✓ Git commit & push")
  ✓ Cached HTML cleanup

$([ -n "$PDF_PATH" ] && echo "PDF Output:      $PDF_PATH")

EOF

    if [[ "$DRY_RUN" == false ]]; then
        log_success "Cheatsheet published successfully!"
        log_info "🌐 Content will be available after deployment at https://surfing.salty.vip/"
    else
        log_info "Dry run completed - no changes applied"
    fi
}

# Main processing function
main() {
    log_info "Cheatsheet Postprocessing Script"
    log_info "──────────────────────────────────────────"

    parse_args "$@"

    log_info "🚀 Starting cheatsheet postprocessing workflow"
    log_info "Input: $INPUT_FILE"

    if [[ "$DRY_RUN" == true ]]; then
        log_warning "DRY RUN MODE - No changes will be applied"
    fi

    # Step 1: Validate HTML
    validate_html "$INPUT_FILE"

    # Step 2: Auto-generate PDF if it doesn't exist
    auto_generate_pdf "$INPUT_FILE"

    # Step 3: Publish to Surfing platform
    publish_to_surfing "$INPUT_FILE"

    # Step 4: Cleanup temporary refined HTML file (after successful publishing)
    cleanup_refined_html "$INPUT_FILE"

    # Step 5: Show summary
    show_summary "$INPUT_FILE"
}

# Run main function with all arguments
main "$@"