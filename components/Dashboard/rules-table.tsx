"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Rule {
  id: string;
  text: string;
}

export default function RulesList() {
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", text: "All team members must attend weekly meetings" },
    { id: "2", text: "Project updates should be submitted by Friday" },
    { id: "3", text: "Code reviews are required before merging" },
  ]);

  const [newRule, setNewRule] = useState("");

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
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="flex items-center justify-between p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
            >
              <span>{rule.text}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteRule(rule.id)}
                className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                aria-label="Delete rule"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>

        {rules.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No rules added yet. Add your first rule above.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
