import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { parseWithZod } from "@conform-to/zod"
import { useForm } from "@conform-to/react"
import { z } from "zod"

const schema = z.object({
  username: z.string(),
})

const getCount = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async (options) => {
    const submission = parseWithZod(options.data, { schema })
    return submission.reply() // Returning this causes the error
  })

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
    async onSubmit(event, context) {
      event.preventDefault()
      await getCount({
        data: context.formData,
      })
    },
  })

  return (
    <form
      id={form.id}
      action={getCount.url}
      onSubmit={form.onSubmit}
      method="post"
      encType="multipart/form-data"
    >
      <div>{form.errors}</div>
      <div>
        <label>Username</label>
        <input type="text" name={fields.username.name} />
        <div>{fields.username.errors}</div>
      </div>
      <button>Submit</button>
    </form>
  )
}
