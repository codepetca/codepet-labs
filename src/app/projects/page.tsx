import { readFile } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";

import { ProjectCard, type ProjectCardProject } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";

import projects from "../../../content/projects.json";

const projectList = projects as ProjectCardProject[];

async function getLaunchNote() {
  const filePath = path.join(
    process.cwd(),
    "content",
    "updates",
    "2026-summer-launch.md",
  );
  const markdown = await readFile(filePath, "utf8");
  const lines = markdown.trim().split(/\r?\n/);
  const title = lines[0]?.replace(/^#\s*/, "") ?? "Demos soon";
  const body = lines.slice(1).join("\n").trim();

  return { title, body };
}

function renderMarkdownBlocks(markdown: string) {
  return markdown.split(/\n\n+/).map((block) => {
    if (block.startsWith("- ")) {
      return (
        <ul key={block} className="flex flex-wrap gap-2">
          {block.split("\n").map((line) => (
            <li
              key={line}
              className="rounded-md border border-border bg-card-soft px-3 py-1.5 text-xs font-semibold text-muted"
            >
              {line.replace(/^- /, "")}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={block} className="text-sm leading-5 text-muted">
        {block}
      </p>
    );
  });
}

export default async function ProjectsPage() {
  const launchNote = await getLaunchNote();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <Image
            src="/images/visual-showcase.svg"
            alt="Demo gallery placeholder"
            width={640}
            height={420}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <aside className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
          <h1 className="text-2xl font-semibold tracking-normal text-foreground sm:text-4xl">
            Demos soon
          </h1>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            {launchNote.title}
          </h2>
          <div className="mt-4 space-y-3">
            {renderMarkdownBlocks(launchNote.body)}
          </div>
        </aside>
      </section>

      <div className="mt-10 sm:mt-14">
        <SectionHeading title="Prototypes" />
      </div>

      <div className="mt-7 grid gap-3">
        {projectList.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </main>
  );
}
