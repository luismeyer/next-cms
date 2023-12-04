"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

export type RowDef = {
  id: string;
  name: string;
  status: JSX.Element;
  createdAt: string;
};

export const columns: ColumnDef<RowDef>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      if (!status) {
        return null;
      }

      return (
        <Badge variant={status === "published" ? "default" : "outline"}>
          {String(status)}
        </Badge>
      );
    },
  },
];
