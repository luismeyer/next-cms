import Link from "next/link";
import { ContentType } from "../definition";
import { createLink } from "../../next/base-url";
import { Button } from "../../components/ui/button";

type ListProps = {
  contentType: ContentType;
  link: { cms: string; api: string };
};

export async function ListPage({ contentType, link }: ListProps) {
  const { name, dbAdapter } = contentType;

  const items = await dbAdapter.api.list();

  return (
    <div className="grid gap-2">
      <div className="flex justify-between p-4 items-center">
        <h1 className="text-2xl">{name}</h1>

        <Button asChild>
          <Link href={createLink(link.cms, name, "new")}>create</Link>
        </Button>
      </div>

      <hr />

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <div className="flex gap-2">
              <span>{item.id}</span>
              <span>{item.fields.name}</span>
              <span>{item.createdAt.toDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
