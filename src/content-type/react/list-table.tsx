"use client";

import { useRouter } from "next/navigation";

import { ColumnDef, Row } from "@tanstack/react-table";

import { DataTable } from "../../components/data-table";
import { createLink } from "../../next/base-url";
import { RowDef } from "./list-columns";

interface DataTableProps {
  columns: ColumnDef<RowDef>[];
  data: RowDef[];
  link: { cms: string; api: string };
  contentTypeName: string;
}

export function ListTable({
  columns,
  data,
  link,
  contentTypeName,
}: DataTableProps) {
  const router = useRouter();

  function handleRowClick(row: Row<RowDef>) {
    const url = createLink(link.cms, contentTypeName, row.original.id);

    return () => router.push(url);
  }

  return (
    <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
  );
}
