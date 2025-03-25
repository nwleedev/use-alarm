"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/css";
import emojiData from "@/models/emoji/data.json";
import { useState } from "react";

interface EmojiSelectSheetProps {
  trigger: React.ReactNode;
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiSelectSheet({
  trigger,
  onEmojiSelect,
}: EmojiSelectSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("smileys");
  const categories = Object.entries(emojiData.categories);

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="h-[55vh] overflow-hidden flex flex-col p-4"
        side="bottom"
      >
        <SheetHeader className="mb-2">
          <SheetTitle className="text-lg">Select Emoji</SheetTitle>
          <SheetDescription className="text-sm">
            Choose a category and select an emoji
          </SheetDescription>
        </SheetHeader>

        {/* Category Tabs */}
        <div className="flex justify-center w-full">
          <div className="flex overflow-x-auto scrollbar-hide py-2 gap-1.5 border-b w-full max-w-[480px]">
            {categories.map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "px-2.5 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors flex-shrink-0",
                  selectedCategory === key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji Grid */}
        <div className="overflow-y-auto flex-1 pt-2 flex w-full justify-center">
          <div className="flex w-full max-w-[480px]">
            <div className="grid grid-cols-[repeat(auto-fill,40px)] grid-rows-[repeat(auto-fill,40px)] gap-0 w-full justify-center">
              {categories
                .find(([key]) => key === selectedCategory)?.[1]
                .emojis.map((emoji: string, index: number) => (
                  <SheetClose
                    key={index}
                    onClick={() => {
                      onEmojiSelect(emoji);
                    }}
                    className="aspect-square w-10 h-10 flex items-center justify-center text-2xl hover:bg-muted rounded-md transition-colors"
                  >
                    {emoji}
                  </SheetClose>
                ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
