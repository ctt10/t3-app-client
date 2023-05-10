import Link from "next/link";
import Image from "next/image";
import images from "@/Assets";

export default function Footer() {

	return (
		<div className="w-full bg-black">
			<div className="">
				<div className="">
					<div id="">
						<Image 
							src={images?.Logo} 
							height={25}
							width={25}
							alt="" 
						/>
					</div>
					<div className="">
						<div className="">
							<h3 className="">Products</h3>
							<a
								href=""
								target="_blank"
								rel="noreferrer"
							>
								Macrame
							</a>
							<a
								href=""
								target="_blank"
								rel="noreferrer"
							>
								Gemstones
							</a>
						</div>
						<div className="">
							<h3 className="">About</h3>
						</div>
						<div className="">
							<h3 className="">See Also</h3>
							<a
								href=""
								target="_blank"
								rel="noreferrer"
							>
								Support
							</a>
						</div>
					</div>
				</div>

			</div>
			<p>@FrozenTime 2023</p>
		</div>
	);
}
