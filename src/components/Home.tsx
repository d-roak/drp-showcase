import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="w-screen text-center">
			<div className="grid grid-cols-2 gap-4 max-w-[600px] mx-auto">
				<Link to="/grid-drp">
					<div className="p-4 bg-white rounded-xl">Grid example with DRP</div>
				</Link>
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
			</div>
		</div>
	);
}
