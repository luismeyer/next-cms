import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { Button } from "../../components/ui/button";
import { createLink } from "../../next/base-url";
import { ContentType } from "../definition";
import { columns, RowDef } from "./list-columns";
import { ListTable } from "./list-table";

type ListProps = {
  contentType: ContentType;
  link: { cms: string; api: string };
};

export const NEW_ITEM_SLUG = "create";

export async function ListPage({ contentType, link }: ListProps) {
  const { name, dbAdapter } = contentType;

  const items = await dbAdapter.api.list();

  const rows: RowDef[] = items.map((item) => ({
    id: item.id,
    name: item.fields.name,
    status: item.fields.status,
    createdAt: formatDistanceToNow(item.createdAt),
  }));

  return (
    <div className="grid gap-2">
      <div className="flex justify-between p-4 items-center">
        <h1 className="text-2xl">{name}</h1>

        <Button asChild>
          <Link href={createLink(link.cms, name, NEW_ITEM_SLUG)}>create</Link>
        </Button>
      </div>

      <hr />

      <div className="p-4">
        <ListTable
          columns={columns}
          data={rows}
          link={link}
          contentTypeName={name}
        />
      </div>
    </div>
  );
}
