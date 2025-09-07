import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Upload, Zap } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex gap-3">
      <Link href="/dashboard/students">
        <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 transition-colors">
          <Upload className="w-4 h-4" />
          Import Students
        </Button>
      </Link>
      <Link href="/dashboard/questions">
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg">
          <Plus className="w-4 h-4" />
          Create Question
        </Button>
      </Link>
    </div>
  );
}