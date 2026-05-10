package tree_sitter_monkey_c_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_monkey_c "github.com/bombsimon/tree-sitter-monkey-c/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_monkey_c.Language())
	if language == nil {
		t.Errorf("Error loading MonkeyC grammar")
	}
}
