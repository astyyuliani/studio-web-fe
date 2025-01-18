import PropTypes from "prop-types";
import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";

export default function ReviewCard({ userName, rating, review }) {
  return (
    <Card className="max-h-40 min-w-48 max-w-64 shadow-md lg:max-h-52 lg:min-w-96 lg:max-w-[520px]">
      <CardContent className="flex flex-col gap-[10px] overflow-hidden p-2 lg:p-5">
        <div className="flex flex-row items-center gap-5">
          <div className="flex flex-col lg:gap-[10px]">
            <h3 className="font-medium lg:text-2xl">{userName}</h3>
            <div className="inline-flex gap-1">
              {[...Array(rating)].map((_, index) => (
                <Star
                  key={index}
                  className="size-4 fill-current text-yellow-400 lg:size-6"
                />
              ))}
            </div>
          </div>
        </div>
        <p className="line-clamp-3 whitespace-pre-line">{review}</p>
      </CardContent>
    </Card>
  );
}

ReviewCard.propTypes = {
  userName: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
};
