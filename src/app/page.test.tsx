import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "../app/page";

describe("Main page", () => {
	beforeEach(() => {
		vi.mock("@supabase/supabase-js");
		vi.mock("@/lib/db");
		vi.mock("react-dom", async () => ({
			...(await vi.importActual("react-dom")),
			useFormStatus: vi.fn().mockReturnValue({ pending: false }),
		}));
		// import { useFormStatus } from "react-dom";
	});

	describe("Hero content", () => {
		beforeEach(() => {
			render(<Page />);
		});

		it("Need to render the talk title", () => {
			expect(screen.getByRole("heading")).toHaveTextContent(
				"ArqTalks - Arquitetura de Eventos",
			);
		});

		it("Need to render the talk subtitle", () => {
			expect(
				screen.getByText(/27 Março 2024 | Sistema de simulação de eventos/i),
			).toBeInTheDocument();
		});
	});

	describe.todo("Create employee form", () => {
		beforeEach(() => {
			render(<Page />);
		});

		it("need to allow users to input their name", () => {
			const input = screen.getByPlaceholderText(/escreva seu nome/i);

			userEvent.click(input);
			userEvent.type(input, "Testing");

			expect(input).toHaveTextContent("Testing");
		});
	});
});
