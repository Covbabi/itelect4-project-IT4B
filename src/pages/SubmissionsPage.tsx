import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, type SubmissionFormValues } from "@/schemas/submissionSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const addSubmissionMutation = {
  isPending: false,
  mutate: (
    values: SubmissionFormValues,
    options?: { onSuccess?: () => void }
  ) => {
    console.log("Submitting:", values);
    options?.onSuccess?.();
  },
};

export default function SubmissionsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      submissionUrl: "",
    },
  });

  const onSubmit = (values: SubmissionFormValues) => {
    addSubmissionMutation.mutate(values, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Your Project</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        {/* Title Field */}
        <div className="grid gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            aria-invalid={errors.title ? true : undefined}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="grid gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            {...register("description")}
            aria-invalid={errors.description ? true : undefined}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* GitHub URL Field */}
        <div className="grid gap-1.5">
          <Label htmlFor="submissionUrl">GitHub URL</Label>
          <Input
            id="submissionUrl"
            {...register("submissionUrl")}
            aria-invalid={errors.submissionUrl ? true : undefined}
          />
          {errors.submissionUrl && (
            <p className="text-sm text-red-600">{errors.submissionUrl.message}</p>
          )}
        </div>

        <Button type="submit" disabled={addSubmissionMutation.isPending}>
          {addSubmissionMutation.isPending ? "Submitting..." : "Submit Project"}
        </Button>
      </form>
    </div>
  );
}