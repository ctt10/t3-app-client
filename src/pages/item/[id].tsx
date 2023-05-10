import { useRouter } from 'next/router'
import { SingleItem } from "@/components";

const ItemDetailsPage = () => {

	const router = useRouter()
	const { id: itemId } = router.query

	
	//instead of fetching, is there a way to pass this or extract it from the gallery array, this will speed up loading, reduce api request	
	return (

		<div className="flex h-full w-full justify-center py-20">
			{	itemId && (
				<SingleItem itemId={itemId}/>
			)	}
		</div>
	);
}

export default ItemDetailsPage;
