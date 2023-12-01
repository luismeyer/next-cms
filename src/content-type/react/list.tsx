import { Form } from "./form";
import { ContentType } from "../definition";

type ListProps = {
  contentType: ContentType;
};

export async function ContentTypeList({ contentType }: ListProps) {
  const { name, dbAdapter, fieldsSchema } = contentType;

  const items = await dbAdapter.list();

  return (
    <div className="grid gap-2">
      <h1 className="text-2xl">{name}</h1>
      <hr />
      <ul>
        {items.map((item) => (
          <li>
            <div className="flex gap-2">
              <span>{item.id}</span>
              <span>{item.name}</span>
              <span>{item.createdAt.toDateString()}</span>
            </div>
          </li>
        ))}
      </ul>

      <hr />

      {/* @ts-ignore */}
      <Form fields={fieldsSchema} />
    </div>
  );
}
