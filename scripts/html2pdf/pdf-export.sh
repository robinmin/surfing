function html2pdf() {
  if [ $# -lt 1 ]; then
    echo "Usage: html2pdf <input> [output] [options]"
    echo "Example: html2pdf mypage.html --single-page --viewport=1920x1080 --margin=10px"
    return 1
  fi

  local input="$1"
  shift

  local output=""
  # Check if the next argument looks like a file (doesn't start with -)
  if [ $# -ge 1 ] && [[ ! $1 == -* ]]; then
    output="$1"
    shift
  fi

  # Path to your self-contained Node.js script
  local script_path="$HOME/projects/surfing/scripts/html2pdf/pdf-export.mjs"

  # Default output filename if missing
  if [ -z "$output" ]; then
    local base_name
    base_name=$(basename "$input" .html)
    output="$PWD/${base_name}.pdf"
  fi

  # Call the Node.js script with all remaining arguments
  node "$script_path" "$input" "$output" "$@"
}
