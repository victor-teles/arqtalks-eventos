"use client";
import { createEmployee } from "@/actions/create-employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" isLoading={pending}>
			Cadastrar
		</Button>
	);
}

function NameInput() {
	const { pending } = useFormStatus();

	return (
		<Input
			disabled={pending}
			type="text"
			placeholder="Escreva seu nome"
			maxLength={30}
			required
			name="name"
		/>
	);
}

export function EmployeeForm() {
	return (
		<form
			className="flex w-full max-w-sm items-center space-x-2"
			action={createEmployee}
		>
			<NameInput />
			<SubmitButton />
		</form>
	);
}
