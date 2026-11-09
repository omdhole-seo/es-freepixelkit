"use client";

import type { FormEvent } from "react";

export default function ConfirmDeleteForm({
  action,
  title,
}: {
  action: string;
  title: string;
}) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} method="post" onSubmit={confirmDelete}>
      <input name="_method" type="hidden" value="DELETE" />
      <button className="link-button" type="submit">
        Delete
      </button>
    </form>
  );
}
