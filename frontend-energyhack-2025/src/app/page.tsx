import { FormComponent } from "./components/form-component.component";


export default function Page ()
{


	return (
		<>
			<div className="flex flex-col items-start justify-center text-black h-full mx-20 ">
				<div className="flex flex-col gap-8">
					<h1 className="text-3xl">Something Here</h1>
					<h2 className="text-xl">Something Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else here</h2>
				</div>
				<FormComponent />
			</div>
		</>
	);
}
