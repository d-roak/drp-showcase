import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="w-screen text-center">
			<div className="grid grid-cols-2 gap-4 max-w-[60vw] mx-auto">
				<Link to="/grid-drp">
					<div className="p-4 bg-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all">
						<img
							src="/grid-drp.png"
							aria-label="grid image"
							className="mb-2 h-max rounded-lg"
						/>
						<span className="text-blue-300 text-xl hover:text-blue-500 transition-all">
							Grid with DRP
						</span>
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
