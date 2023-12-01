import { z } from "zod";
import { Entity } from "../../db/adapter";

type FormProps = {
  fields: z.ZodObject<z.ZodRawShape>;
};

export async function Form({ fields }: FormProps) {
  return (
    <form>
      Form
      {Object.entries(fields.shape).map(([key, value]) => {
        console.log(value instanceof z.ZodString);

        if (value instanceof z.ZodString) {
          return <input type="text" name={key} />;
        }

        return <div></div>;
      })}
    </form>
  );
}
