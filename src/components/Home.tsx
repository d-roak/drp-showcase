import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="w-screen text-center">
			<div className="grid grid-cols-2 gap-4 max-w-[80vw] mx-auto">
				<Link to="/grid-drp">
					<div className="p-4 bg-gray-700 rounded-xl">
						<img src="/grid-drp.png" className="mb-2 h-max" />
						<span className="text-blue-300">Grid with DRP</span>
					</div>
				</Link>
				{/*
					<Link to="/">
						<div className="p-4 bg-white rounded-xl">
							Grid example without DRP
						</div>
					</Link>
					<Link to="/">
						<div className="p-4 bg-white rounded-xl">Chat example with DRP</div>
					</Link>
					<Link to="/">
						<div className="p-4 bg-white rounded-xl">Chat example with DRP</div>
					</Link>
					*/}
			</div>
		</div>
	);
}
