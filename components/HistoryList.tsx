import React from "react";
import { HistoryItem } from "./HistoryItem";

interface HistoryListProps {
  histories: { id: number; title: string; timestamp: string }[];
  onDelete: (id: number) => void;
  onRename: (id: number, newTitle: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  histories,
  onDelete,
  onRename,
}) => {
  if (histories.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No chats yet. Start a new one!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {histories.map((history) => (
        <HistoryItem
          key={history.id}
          history={history}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
};