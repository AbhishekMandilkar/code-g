"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Trash2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { CodeReviewRules } from "@prisma/client";
import fetcher from "@/lib/fetcher";
import axios from "axios";
import { toast } from "sonner";

interface Rule {
  id: string;
  text?: string; // todo remove this
  rule?: string;
}

type Props = {
  repoId: string | null;
  isRepoListLoading?: boolean;
};

export default function RulesList(props: Props) {
  const { repoId, isRepoListLoading } = props;
  const { mutate } = useSWRConfig();

  const { data: ruleArray = [], isLoading } = useSWR<CodeReviewRules[]>(
    `/api/rules?repoId=${repoId}`,
    fetcher
  );

  const [isAddLoading, setIsAddLoading] = useState<boolean>(false);

  const [newRule, setNewRule] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string | undefined>("");

  const deleteRule = async (ruleId: string) => {
    const currentRule = ruleArray?.find((rule) => rule.id === ruleId);
    try {
      console.log("here");

      try {
        console.log(currentRule?.rule);
        const resp = await axios({
          method: "post",
          url: "/api/rules",
          data: {
            id: ruleId.toString(),
            isDeleted: true,
            repoId,
            rule: currentRule?.rule,
          },
        });
        if (resp.status === 200) {
          toast.success("Rule Deleted Successfully");
        }
      } catch (err) {
        console.log(err);
        toast.error("Delete Failed");
      }

      mutate(`/api/rules?repoId=${repoId}`);
    } catch (error) {
      console.error("Failed to delete rule", error);
    }
  };

  const addRule = async () => {
    if (newRule.trim() === "") {
      toast.error("Please add the appropriate rule");
      setNewRule("");
      return;
    }

    const isRulePresent = ruleArray?.some(({ rule }) => rule === newRule);
    if (isRulePresent) {
      toast.error("This rule already exists");
      return;
    }

    setIsAddLoading(true);
    try {
      const resp = await axios({
        method: "post",
        url: "/api/rules",
        data: { repoId, rule: newRule },
      });
      if (resp.status === 200) {
        mutate(`/api/rules?repoId=${repoId}`);
        setIsAddLoading(false);
        toast.success("Rule added successfully");
      }
    } catch (err) {
      setIsAddLoading(false);
      // @ts-expect-error - todo
      const errorMessage = err?.response?.data?.error;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
    setNewRule("");
  };

  // const startEditing = (rule: Rule) => {
  //   setEditingId(rule.id);
  //   setEditText(rule.text);
  // };

  // const saveEdit = () => {
  //   if (editText.trim() === "") return;

  //   setRules(
  //     ruleArray?.map((rule) =>
  //       rule.id === editingId ? { ...rule, text: editText } : rule
  //     )
  //   );
  //   setEditingId(null);
  // };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const loaderView = () => (
    <div className="flex flex-col justify-center items-center space-y-4 min-h-1/2">
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
      <Skeleton className="h-10 w-[100%]" />
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto mt-5 min-h-2/3">
      <CardHeader className="sticky top-0 pb-2 gap-4">
        <CardTitle className="text-lg font-bold">Rules List</CardTitle>
        <div className="flex gap-2 ">
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
          <Button onClick={addRule}>
            {isAddLoading ? <Loader2 className="animate-spin" /> : "Add Rule"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="">
        {(() => {
          if (isLoading || isRepoListLoading) {
            return loaderView();
          }

          if (ruleArray?.length === 0) {
            return (
              <div className="text-center py-4 text-muted-foreground">
                No rules added yet. Add your first rule above.
              </div>
            );
          }

          return (
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
                            // saveEdit();
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
                          // onClick={saveEdit}
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
                      <span className="text-sm font-mono">{rule.rule}</span>
                      <div className="flex gap-1">
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          // onClick={() => startEditing(rule)}
                          className="h-8 w-8 text-muted-foreground hover:text-muted-foreground/90 hover:bg-muted-foreground/10 cursor-pointer"
                          aria-label="Edit rule"
                        > */}
                        {/* TODO <Pencil className="h-4 w-4 text-muted-foreground" /> */}
                        {/* </Button> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRule(rule.id)}
                          className="h-8 w-8 text-destructive/80 hover:text-destructive/90 hover:bg-destructive/10 cursor-pointer"
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
          );
        })()}
      </CardContent>
    </Card>
  );
}
