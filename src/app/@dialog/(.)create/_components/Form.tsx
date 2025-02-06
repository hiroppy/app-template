"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { create } from "../../../_actions/items";
import { Input } from "../../../_components/Input";
import { type ItemSchema, itemSchema } from "../../../_schemas/items";
import { Dialog } from "../../_components/Dialog";

export function Form() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ItemSchema>({
    mode: "onChange",
    resolver: zodResolver(itemSchema),
  });

  const submit: SubmitHandler<ItemSchema> = async (values) => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      const { success, message } = await create(values);

      if (success) {
        router.push("/");
      } else {
        alert(message);
      }
    });
  };

  return (
    <Dialog>
      <div className="space-y-6">
        <h2 className="text-center">New memo</h2>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input
            {...register("content")}
            disabled={isPending}
            placeholder="write your memo..."
            error={errors.content?.message}
          />
        </form>
      </div>
    </Dialog>
  );
}
