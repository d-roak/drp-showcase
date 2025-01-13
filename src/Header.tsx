import { useState, useEffect } from "react";
import { formatPeerId } from "./utils/formatting";
import type { DRPNode } from "@ts-drp/node";

export default function Header(props: { node: DRPNode }) {
    const [peers, setPeers] = useState<string[]>([]);
    useEffect(() => {
        const interval = setInterval(() => {
            setPeers(props.node.networkNode.getAllPeers());
        }, 1000);
        return () => clearInterval(interval);
    }, [props.node.networkNode]);

    return (
        <header className="mx-auto w-fit mt-10">
            <h1>DRP Showcase</h1>
            <div className="mb-10">
                <p>Your peer id is: {formatPeerId(props.node.networkNode.peerId)}</p>
                <p>
                    Your connections:{" "}
                    {peers.map((peer, index) => (
                        <span key={index}>
                            {formatPeerId(peer)}
                            {index < props.node.networkNode.getAllPeers().length - 1 && ", "}
                        </span>
                    ))}
                </p>
            </div>
        </header>
    );
}
