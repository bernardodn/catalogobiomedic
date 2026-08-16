import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { DataProvider } from "@/lib/data/provider";
import { resetDemoDatabase } from "@/lib/data/demo/database";
import { DashboardContent } from "./dashboard-content";

describe("DashboardContent", () => {
  beforeEach(() => {
    localStorage.clear();
    resetDemoDatabase();
  });

  it("shows exact catalog statistics and recent items", async () => {
    render(
      <DataProvider>
        <DashboardContent />
      </DataProvider>,
    );

    expect(await screen.findByText("18", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("14", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("4", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("13", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("17", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("Recovery Performance")).toBeInTheDocument();
  });
});
