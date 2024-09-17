import { NewsItem } from '@/lib/types'
import React from 'react'
import { ExternalLink } from 'lucide-react';


const NewsCard = ({data}: {data: NewsItem[]}) => {
  return (
        <div className="flex flex-col space-y-4 m-5">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col lg:flex-row items-start p-4 bg-white rounded-lg shadow-md relative min-h-64">
            <div className="flex-none w-full lg:w-1/3 mb-4 lg:mb-0">
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg" />
            </div>
  
            <div className="flex flex-col flex-grow lg:ml-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.snippet}</p>
              <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">
                Read More
                <ExternalLink className="ml-2" />
              </a>
            </div>
  
            <div className="absolute bottom-0 left-0 w-full bg-gray-100 text-center py-2 rounded-b-lg">
              <p className="text-sm font-medium text-gray-700">Found on Google</p>
            </div>
          </div>
        ))}
      </div>

  )
}

export default NewsCard