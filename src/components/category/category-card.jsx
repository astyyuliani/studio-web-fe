import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";



export default function CategoryCard({ category }) {
  return (
    category.category_packages.length > 0 && (
      <Card className="max-w-xs rounded-none border-none shadow-lg md:max-w-[350px]">
        <CardContent className="flex flex-col justify-center gap-2 p-[10px]">
          <img
            src={category.images[0]}
            alt={category.name}
            className="object-cover md:h-52 md:w-80 object-center"
          />
          <div className="flex w-full flex-col">
            <p className="text-xl font-normal">{category.name}</p>
            <hr className="my-2 opacity-0" />
            <p className="text-sm truncate opacity-70">
              {category.deskripsi}
            </p>
            <hr className="my-2 opacity-0" />
            <div className="flex items-center justify-end">
            <Link
              to={`/category/${category.id}`}
              className={cn(buttonVariants({size:"sort",}),  "font-bold text-sm"  )}

            >
              Detail
            </Link>
          </div>
          </div>
        </CardContent>
      </Card>
    )
  );
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    category_packages: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};
