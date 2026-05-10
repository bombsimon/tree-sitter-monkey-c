set shell := ["bash", "-cu"]

repo_root := justfile_directory()
nvim_parser_dir := env_var_or_default("NVIM_PARSER_DIR", env_var("HOME") + "/.local/share/nvim/site/parser")
nvim_queries_dir := env_var_or_default("NVIM_QUERIES_DIR", env_var("HOME") + "/.config/nvim/queries/monkey_c")

default:
  @just --list

generate:
  tree-sitter generate

test:
  tree-sitter test

test-update:
  tree-sitter test -u

parse-example:
  tree-sitter parse examples/SpeedConverter.mc

[linux]
nvim-install:
  mkdir -p "{{nvim_parser_dir}}"
  cc -O2 -fPIC -I./src -c src/parser.c -o /tmp/monkey_c.o
  cc -shared /tmp/monkey_c.o -o "{{nvim_parser_dir}}/monkey_c.so"
  mkdir -p "{{nvim_queries_dir}}"
  cp queries/highlights.scm "{{nvim_queries_dir}}/highlights.scm"
  @echo "Installed parser to {{nvim_parser_dir}}/monkey_c.so"
  @echo "Installed queries to {{nvim_queries_dir}}"

[macos]
nvim-install:
  mkdir -p "{{nvim_parser_dir}}"
  cc -O2 -fPIC -I./src -c src/parser.c -o /tmp/monkey_c.o
  cc -dynamiclib /tmp/monkey_c.o -o "{{nvim_parser_dir}}/monkey_c.dylib"
  mkdir -p "{{nvim_queries_dir}}"
  cp queries/highlights.scm "{{nvim_queries_dir}}/highlights.scm"
  @echo "Installed parser to {{nvim_parser_dir}}/monkey_c.dylib"
  @echo "Installed queries to {{nvim_queries_dir}}"
