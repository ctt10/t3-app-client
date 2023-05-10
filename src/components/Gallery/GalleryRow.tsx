import React from "react"
import { type IGalleryItem } from "@/types";
import { GalleryItem } from "@/components";

interface CustomPageProps {
	row: IGalleryItem[]
	key: number
}

export default function GalleryRow(props: CustomPageProps) {
	const { row } = props;

	return (
		<div className="flex flex-wrap mt-20 justify-center">
			{row.length === 3 ? (
				<div className="flex flex-wrap w-full max-w-full items-start justify-center">
					{row?.map(
						(object: IGalleryItem, i: number) => 
							<div
								className={
									i === 1
										? "mb-6 mt-36 rounded-2xl"
										: "my-6 mx-10 rounded-2xl"
								}
								key={i}
							>
								<GalleryItem
									item={object}
									key={i}
								/>
							</div>
					)}
				</div>
			) : row.length < 3 ? (
				<div className="flex flex-wrap w-full max-w-full items-start justify-center">
					{row?.map(
						(object: IGalleryItem, i: number) => i < 3 &&
							<div
								className={
									i === 1
										? "my-6 rounded-2xl"
										: "my-6 mx-10 rounded-2xl"
								}
								key={i}
							>
								<GalleryItem
									item={object}
									key={i}
								/>
							</div>
					)}
				</div>
			) : null}
		</div>
	);
}