"use client";

import { useState } from "react";
import { Trash2, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";

interface Rule {
  id: string;
  text: string;
}

type Props = {
  repoId: string | null;
};

const fetcher = async <T = unknown,>(
  ...args: Parameters<typeof fetch>
): Promise<T> => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export default function RulesList(props: Props) {
  const { repoId } = props;
  const { data: ruleArray = [], isLoading } = useSWR(
    `/api/rules?repoId=${repoId}`,
    fetcher
  );

  const [rules, setRules] = useState<Rule[]>([]); // todo remove

  const [newRule, setNewRule] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const deleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const addRule = () => {
    if (newRule.trim() === "") return;

    const newId = (
      Math.max(0, ...rules.map((r) => Number.parseInt(r.id))) + 1
    ).toString();
    setRules([...rules, { id: newId, text: newRule }]);
    setNewRule("");
  };

  const startEditing = (rule: Rule) => {
    setEditingId(rule.id);
    setEditText(rule.text);
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;

    setRules(
      ruleArray?.map((rule) =>
        rule.id === editingId ? { ...rule, text: editText } : rule
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center space-x-4 h-full">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[450px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[450px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    );
  }
  return (
    <Card className="w-full max-w-2xl mx-auto mt-5">
      <CardHeader>
        <CardTitle>Rules List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new rule..."
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addRule();
              }
            }}
            className="flex-1"
          />
          <Button onClick={addRule}>Add Rule</Button>
        </div>

        <ul className="space-y-2">
          {ruleArray?.map((rule) => (
            <li
              key={rule.id}
              className="flex items-center justify-between p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
            >
              {editingId === rule.id ? (
                <>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEdit();
                      } else if (e.key === "Escape") {
                        cancelEdit();
                      }
                    }}
                    className="flex-1 mr-2"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={saveEdit}
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                      aria-label="Save edit"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={cancelEdit}
                      className="h-8 w-8 text-muted-foreground hover:text-muted-foreground/90 hover:bg-muted-foreground/10"
                      aria-label="Cancel edit"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span>{rule.rule}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(rule)}
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                      aria-label="Edit rule"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRule(rule.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      aria-label="Delete rule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {ruleArray?.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No rules added yet. Add your first rule above.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
