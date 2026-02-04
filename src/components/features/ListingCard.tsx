'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  isSuperhost?: boolean;
  isNew?: boolean;
}

export const ListingCard = ({
  id,
  title,
  location,
  image,
  price,
  rating,
  reviewCount,
  isSuperhost = false,
  isNew = false,
}: ListingCardProps) => {
  return (
    <Link href={`/listings/${id}`}>
      <Card hoverable className="overflow-hidden cursor-pointer group">
        <div className="relative w-full h-64 overflow-hidden bg-gray-200 dark:bg-gray-800">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isSuperhost && <Badge variant="success">Superhost</Badge>}
            {isNew && <Badge variant="primary">New</Badge>}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 left-3 bg-gray-900 bg-opacity-70 text-white px-3 py-1 rounded-lg">
            <p className="text-sm font-semibold">
              ${price} <span className="text-xs font-normal">/night</span>
            </p>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            {title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{location}</p>

          <div className="flex items-center gap-1">
            <Rating value={Math.round(rating)} readOnly size="sm" showLabel={false} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">({reviewCount})</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
