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
import { createContext, useContext, useState } from "react";

interface EmojiSelectSheetProps {
  trigger: React.ReactNode;
  onEmojiSelect: (emoji: string) => void;
}

interface EmojiCategory {
  name: string;
  emojis: string[] | string[][];
}

interface EmojiData {
  categories: {
    [key: string]: EmojiCategory;
  };
}

const SKIN_TONES = ["👤", "🏻", "🏼", "🏽", "🏾", "🏿"];
const categories = Object.entries(emojiData.categories);
type CategoryKey = keyof typeof emojiData.categories;

const initialForm = {
  category: "smileys" as CategoryKey,
  toneIndex: 0,
  isToneClicked: false,
};

const EmojiSheetContext = createContext({
  category: "smileys" as CategoryKey,
  toneIndex: 0,
  isToneClicked: false,
  onEmojiSelect: (emoji: string) => {},
  onCategoryClick: (category: CategoryKey) => {},
  onToneClick: () => {},
  onToneSelect: (index: number) => {},
});

const EmojiItem = () => {
  const { category, toneIndex, onEmojiSelect } = useContext(EmojiSheetContext);
  const currentCategory = emojiData.categories[category];
  if (!category) return null;

  if (category === "people") {
    // For people category, show emojis with selected skin tone
    return (currentCategory.emojis as string[][]).map((variations, index) => (
      <SheetClose
        key={index}
        onClick={() => {
          onEmojiSelect(variations[toneIndex]);
        }}
        className="aspect-square w-10 h-10 flex items-center justify-center text-2xl hover:bg-muted rounded-md transition-colors"
      >
        {variations[toneIndex]}
      </SheetClose>
    ));
  }

  // For other categories, show emojis as before
  return (currentCategory.emojis as string[]).map((emoji, index) => (
    <SheetClose
      key={index}
      onClick={() => {
        onEmojiSelect(emoji);
      }}
      className="aspect-square w-10 h-10 flex items-center justify-center text-2xl hover:bg-muted rounded-md transition-colors"
    >
      {emoji}
    </SheetClose>
  ));
};

const CategorySelect = () => {
  const { category: selectedCategory, onCategoryClick } =
    useContext(EmojiSheetContext);
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
      {categories.map(([key, category]) => (
        <button
          key={key}
          onClick={() => {
            onCategoryClick(key as CategoryKey);
          }}
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
  );
};

const SkinToneSelect = () => {
  const { toneIndex, isToneClicked, onToneClick, onToneSelect } =
    useContext(EmojiSheetContext);

  return (
    <div
      className={cn(
        "flex flex-shrink-0 transition-all duration-100 ease-in-out",
        !isToneClicked ? "w-8" : "w-48"
      )}
    >
      {!isToneClicked && (
        <button
          onClick={onToneClick}
          className={cn(
            "w-8 h-8 flex items-center justify-center text-xl rounded-md transition-colors text-primary-foreground"
          )}
        >
          {SKIN_TONES[toneIndex]}
        </button>
      )}
      {isToneClicked &&
        SKIN_TONES.map((tone, index) => (
          <button
            key={index}
            onClick={() => {
              onToneSelect(index);
            }}
            className={cn(
              "w-8 h-8 flex items-center justify-center text-xl rounded-md transition-colors text-primary-foreground"
            )}
          >
            {tone || "👤"}
          </button>
        ))}
    </div>
  );
};

export function EmojiSelectSheet({
  trigger,
  onEmojiSelect,
}: EmojiSelectSheetProps) {
  const [form, setForm] = useState({
    category: "smileys" as keyof typeof emojiData.categories,
    toneIndex: 0,
    isToneClicked: false,
  });
  const onClose = () => {
    setForm({ ...initialForm });
  };
  const onCategoryClick = (category: CategoryKey) => {
    setForm({ ...form, category });
  };

  const onToneClick = () => {
    setForm({ ...form, isToneClicked: true });
  };
  const onToneSelect = (index: number) => {
    setForm({ ...form, toneIndex: index, isToneClicked: false });
  };

  return (
    <EmojiSheetContext.Provider
      value={{
        ...form,
        onCategoryClick,
        onEmojiSelect,
        onToneClick,
        onToneSelect,
      }}
    >
      <Sheet
        onOpenChange={(state) => {
          if (!state) {
            onClose();
          }
        }}
      >
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
            <div className="flex py-2 gap-1.5 border-b w-full max-w-[480px]">
              <CategorySelect />
              <SkinToneSelect />
            </div>
          </div>

          {/* Emoji Grid */}
          <div className="overflow-y-auto flex-1 pt-2 flex w-full justify-center">
            <div className="flex w-full max-w-[480px]">
              <div className="grid grid-cols-[repeat(auto-fill,40px)] grid-rows-[repeat(auto-fill,40px)] gap-0 w-full justify-center">
                <EmojiItem />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </EmojiSheetContext.Provider>
  );
}
