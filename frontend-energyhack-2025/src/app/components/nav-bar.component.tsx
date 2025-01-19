import Image from "next/image";
import logo from "/public/logo.png";

export function NavBar ()
{
	return (
		<>
			<header className="w-full p-5 flex flex-row justify-center items-center gap-2">
				<div className="bg-white rounded-full">
					<Image src={ logo } alt={ "logo png" } width={ 300 } height={ 300 } className="w-20 h-20 object-cover" priority />
				</div>
				<h1 className="font-mono text-2xl font-bold text-zinc-950">
					r3Charge
				</h1>
			</header>
		</>
	);
}
