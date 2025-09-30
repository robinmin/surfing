#!/bin/bash

# Cheatsheet Preprocessing Script
# Analyzes HTML cheatsheets and prepares configuration for AI optimization
#
# Usage:
#   ./preprocess-cheatsheets.sh <input-file> [options]
#
# What this script does:
#   1. Analyzes HTML structure and content
#   2. Generates processing configuration
#   3. Caches input file for AI processing
#   ⚠️  Does NOT generate optimized files - use AI assistant for that
#
# Options:
#   --style <css-file>      Custom CSS file to preserve user styles
#   --compact               Use compact spacing (default)
#   --comfortable           Use comfortable spacing
#   --no-toc                Disable table of contents completely
#   --mobile-toc            Enable TOC only for mobile
#   --columns <n>           Force specific number of columns (1-4)
#   --margin <value>        PDF margin (default: 10px)
#   --dry-run               Preview changes without generating files

set -e  # Exit on any error

# Default configuration
DEFAULT_MARGIN="10px"
DEFAULT_SPACING="compact"
DEFAULT_TOC="mobile-only"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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
Cheatsheet Preprocessing Script

USAGE:
    $(basename "$0") <input-file> [options]

DESCRIPTION:
    This script analyzes HTML cheatsheets and prepares configuration for AI optimization.
    It caches the input file and generates processing instructions for the AI assistant.
    It does NOT generate optimized files - use the AI assistant for content refinement.

ARGUMENTS:
    <input-file>             HTML cheatsheet file to analyze

OPTIONS:
    --style <css-file>       Custom CSS file to preserve user styles
    --compact               Use compact spacing (default)
    --comfortable           Use comfortable spacing
    --spacious              Use spacious layout
    --no-toc                Disable table of contents completely
    --mobile-toc            Enable TOC only for mobile (default)
    --desktop-toc           Enable TOC for desktop (not recommended for cheatsheets)
    --columns <n>           Force specific number of columns (1-4)
    --margin <value>        PDF margin (default: 10px)
    --no-balance            Skip column balancing optimization
    --preserve-layout       Keep original section distribution
    --dry-run               Preview changes without generating files
    --verbose               Enable detailed logging
    --help, -h              Show this help message

EXAMPLES:
    # Analyze cheatsheet and get AI processing instructions
    $(basename "$0") golang-cheatsheet.html

    # Custom styles with compact layout
    $(basename "$0") react-cheatsheet.html --style custom.css --compact

    # Force 3 columns, no TOC
    $(basename "$0") javascript-cheatsheet.html --columns 3 --no-toc

    # Preview only (no config file generated)
    $(basename "$0") python-cheatsheet.html --dry-run

WHAT THIS SCRIPT DOES:
    ✓ Analyzes HTML structure and content metrics
    ✓ Generates processing configuration JSON
    ✓ Caches input file for AI processing
    ✓ Provides AI assistant instructions
    ⚠️  Does NOT optimize or generate HTML files

NEXT STEPS AFTER RUNNING THIS SCRIPT:
    1. Use AI assistant with docs/prompt_cheatsheets.md
    2. Review and approve the refined HTML file
    3. Generate PDF (optional, using html2pdf tool)
    4. Run postprocess-cheatsheets.sh to publish to website

EOF
}

# Parse command line arguments
parse_args() {
    INPUT_FILE=""
    CUSTOM_CSS=""
    SPACING="$DEFAULT_SPACING"
    TOC_MODE="$DEFAULT_TOC"
    FORCED_COLUMNS=""
    MARGIN="$DEFAULT_MARGIN"
    BALANCE_COLUMNS=true
    PRESERVE_LAYOUT=false
    DRY_RUN=false
    VERBOSE=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --style)
                CUSTOM_CSS="$2"
                shift 2
                ;;
            --compact)
                SPACING="compact"
                shift
                ;;
            --comfortable)
                SPACING="comfortable"
                shift
                ;;
            --spacious)
                SPACING="spacious"
                shift
                ;;
            --no-toc)
                TOC_MODE="none"
                shift
                ;;
            --mobile-toc)
                TOC_MODE="mobile-only"
                shift
                ;;
            --desktop-toc)
                TOC_MODE="always"
                shift
                ;;
            --columns)
                FORCED_COLUMNS="$2"
                shift 2
                ;;
            --margin)
                MARGIN="$2"
                shift 2
                ;;
            --no-balance)
                BALANCE_COLUMNS=false
                shift
                ;;
            --preserve-layout)
                PRESERVE_LAYOUT=true
                shift
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
    
    # Validate custom CSS file if provided
    if [[ -n "$CUSTOM_CSS" ]] && [[ ! -f "$CUSTOM_CSS" ]]; then
        log_error "Custom CSS file not found: $CUSTOM_CSS"
        exit 1
    fi
    
    # Validate column count
    if [[ -n "$FORCED_COLUMNS" ]] && ! [[ "$FORCED_COLUMNS" =~ ^[1-4]$ ]]; then
        log_error "Column count must be between 1 and 4"
        exit 1
    fi
}

# Analyze content structure and layout type for optimization
analyze_content() {
    local input_file="$1"

    # Detect layout type
    local layout_type="unknown"
    if grep -q "grid\|grid-cols" "$input_file"; then
        layout_type="grid"
    elif grep -q "display.*flex\|flex\-" "$input_file"; then
        layout_type="flex"
    elif grep -q "<table\|<td\|<tr" "$input_file"; then
        layout_type="table"
    elif grep -q "column\|columns" "$input_file"; then
        layout_type="multi-column"
    else
        layout_type="single-column"
    fi

    # Extract content metrics
    local sections=$(grep -c "class.*emoji.*>\|<h[1-6]\|section\|\.code-section\|\.card\|\.block" "$input_file" || echo "0")
    local code_blocks=$(grep -c "<pre><code\|<code\|^\`\`\`" "$input_file" || echo "0")
    local file_size=$(wc -c < "$input_file")
    local total_lines=$(wc -l < "$input_file")

    # Analyze section distribution
    local heavy_sections=0
    if grep -q "Testing\|Standard Library\|Concurrency\|Error Handling" "$input_file"; then
        heavy_sections=$(grep -c "Testing\|Standard Library\|Concurrency\|Error Handling" "$input_file")
    fi

    # Detect longest code lines for width optimization
    local max_line_length=0
    if [[ $code_blocks -gt 0 ]]; then
        # Extract code content and measure line lengths
        local temp_code="/tmp/cheatsheet_code_analysis.tmp"
        sed -n '/<pre><code/,/<\/code><\/pre>/p' "$input_file" | \
            sed 's/<[^>]*>//g' | \
            while IFS= read -r line; do
                echo ${#line}
            done | sort -nr | head -1 > "$temp_code" 2>/dev/null || echo "0" > "$temp_code"
        max_line_length=$(cat "$temp_code")
        rm -f "$temp_code"
    fi
    
    # Recommend optimal columns based on content analysis
    local recommended_columns=3
    local balancing_needed=false

    # Column recommendation logic
    if [[ $max_line_length -gt 80 ]]; then
        recommended_columns=2
    elif [[ $sections -gt 15 ]]; then
        recommended_columns=4
    elif [[ $sections -lt 8 ]]; then
        recommended_columns=2
    fi

    # Check if balancing optimization is needed
    if [[ $heavy_sections -gt 2 && $sections -gt 10 ]]; then
        balancing_needed=true
    fi

    # Override with user preference if provided
    if [[ -z "$FORCED_COLUMNS" ]]; then
        FORCED_COLUMNS=$recommended_columns
    fi

    # Set balancing flag
    if [[ "$balancing_needed" == true ]]; then
        BALANCE_COLUMNS=true
    fi
    
    # Store analysis results for the config
    LAYOUT_TYPE="$layout_type"
    SECTIONS_COUNT="$sections"
    CODE_BLOCKS_COUNT="$code_blocks"
    HEAVY_SECTIONS_COUNT="$heavy_sections"
    MAX_LINE_LENGTH="$max_line_length"
}

# Generate processing configuration
generate_config() {
    local filename=$(basename "$INPUT_FILE")
    local slug=$(basename "$filename" .html)
    local working_dir="/tmp/cheatsheets-working"
    local working_file="$working_dir/$filename"
    local output_file="$filename"  # Same name as input

    # Create temporary configuration file for the AI processing
    CONFIG_FILE="/tmp/cheatsheet_config_${slug}.json"
    
    cat > "$CONFIG_FILE" << EOF
{
    "input_file": "$working_file",
    "output_file": "$output_file", 
    "analysis": {
        "layout_type": "$LAYOUT_TYPE",
        "sections_count": $SECTIONS_COUNT,
        "code_blocks_count": $CODE_BLOCKS_COUNT,
        "heavy_sections_count": $HEAVY_SECTIONS_COUNT,
        "max_line_length": $MAX_LINE_LENGTH
    },
    "layout_settings": {
        "custom_css": "$CUSTOM_CSS",
        "spacing": "$SPACING",
        "toc_mode": "$TOC_MODE", 
        "columns": $FORCED_COLUMNS,
        "balance_columns": $BALANCE_COLUMNS,
        "preserve_layout": $PRESERVE_LAYOUT
    },
    "cheatsheet_optimizations": {
        "single_page": true,
        "no_horizontal_scroll": true,
        "compact_layout": true,
        "mobile_responsive": true,
        "code_readability": "priority",
        "intelligent_balancing": true
    },
    "balancing_strategy": {
        "heavy_sections": ["Testing", "Standard Library", "Concurrency", "Error Handling"],
        "optimal_moves": [
            "File Operations → Column 2 (after String Operations)",
            "Standard Library → Column 1 (for balance)",
            "Testing → Column 3 (distribute heavy sections)"
        ],
        "target_variance": "< 10%"
    },
    "pdf_settings": {
        "margin": "$MARGIN",
        "single_page": true,
        "auto_detect_viewport": true
    }
}
EOF

    # Only show config in verbose mode
    if [[ "$VERBOSE" == true ]]; then
        log_success "Generated processing configuration: $CONFIG_FILE"
        cat "$CONFIG_FILE" | head -20
    fi
}

# Main processing function
process_cheatsheet() {
    local filename=$(basename "$INPUT_FILE")
    local slug=$(basename "$filename" .html)
    local working_dir="/tmp/cheatsheets-working"
    local working_file="$working_dir/$filename"
    local output_file="$filename"  # Same name as input, no prefix/suffix
    local pdf_file="$PROJECT_ROOT/public/assets/cheatsheets/en/${slug}.pdf"
    local md_file="${slug}.md"
    local originals_dir="$PROJECT_ROOT/originals/cheatsheets"

    log_info "🚀 Preprocessing: $filename"

    if [[ "$DRY_RUN" == true ]]; then
        log_warning "DRY RUN MODE - No files will be created"
        log_info "Would process:"
        log_info "  - Store original: $INPUT_FILE → $originals_dir/$filename"
        log_info "  - Copy $INPUT_FILE → $working_file"
        log_info "  - Analyze content structure and generate configuration"
        log_info "  - Provide AI assistant instructions for content refinement"
        return 0
    fi

    # Store original file in originals/cheatsheets (if not already from there)
    if [[ "$INPUT_FILE" != "$originals_dir"* ]]; then
        mkdir -p "$originals_dir"
        cp "$INPUT_FILE" "$originals_dir/$filename"
        log_success "Original saved: $originals_dir/$filename"
    fi

    # Copy input file to /tmp working directory
    mkdir -p "$working_dir"
    cp "$INPUT_FILE" "$working_file"

    # Content analysis
    analyze_content "$working_file"

    # Generate configuration
    generate_config
    
    # Step 5: Display complete workflow with real filenames
    cat << EOF

════════════════════════════════════════════════════════════════════════════
📋 4-STEP WORKFLOW FOR: $filename
════════════════════════════════════════════════════════════════════════════

✅ STEP 1: PREPROCESS (COMPLETED)
   ✓ Original stored at: $originals_dir/$filename
   ✓ Working file prepared at: $working_file

📝 STEP 2: AI REFINEMENT (NEXT)
   Use AI assistant to refine content and layout

   COPY AND PASTE THIS PROMPT:
   ────────────────────────────────────────────────────────────────────────
   Please refine the cheatsheet HTML file following the instructions in:
   docs/prompt_cheatsheets.md

   Input file: $working_file
   Target columns: $FORCED_COLUMNS

   After refinement, save to the same path and preview with Playwright.
   ────────────────────────────────────────────────────────────────────────

👀 STEP 3: REVIEW AND APPROVE
   - AI will show browser preview using Playwright
   - Review the refined layout and content
   - Approve or request changes

🚀 STEP 4: PUBLISH
   Run this command after approval:

   ./scripts/postprocess-cheatsheets.sh $working_file

   This will:
   - Validate refined HTML
   - Generate PDF if needed
   - Convert to markdown with frontmatter
   - Publish to website with site navigation
   - Clean up temporary working file (original preserved)

════════════════════════════════════════════════════════════════════════════
EOF
}

# Cleanup function
cleanup() {
    if [[ -n "$CONFIG_FILE" ]] && [[ -f "$CONFIG_FILE" ]]; then
        rm -f "$CONFIG_FILE"
    fi
}

# Set up cleanup on exit
trap cleanup EXIT

# Main execution
main() {
    log_info "Cheatsheet Preprocessing Script"
    log_info "──────────────────────────────────────────"
    
    parse_args "$@"
    process_cheatsheet
}

# Run main function with all arguments
main "$@"
