
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Locale } from '@/lib/i1n-config';
import type { Category, Product } from '@/lib/types';

interface ProductFiltersProps {
  dictionary: {
    filtersTitle: string;
    clearAllButton: string;
    categoryTitle: string;
    priceRangeTitle: string;
    scentTitle: string;
    materialTitle: string;
  };
  categoriesData: Category[];
  allProducts: Product[]; // Added to dynamically generate scent/material filters
}

export function ProductFilters({ dictionary, categoriesData, allProducts }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const locale = routeParams.locale as Locale || 'uz';

  const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.getAll('category') || []);
  const [selectedScents, setSelectedScents] = useState<string[]>(searchParams.getAll('scent') || []);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(searchParams.getAll('material') || []);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 200, // Assuming 200 is a reasonable max for mock data
  ]);

  const [minPriceInput, setMinPriceInput] = useState(String(priceRange[0]));
  const [maxPriceInput, setMaxPriceInput] = useState(String(priceRange[1]));

  const uniqueScents = useMemo(() => {
    const scents = allProducts
      .map(p => p.scent)
      .filter((s): s is string => typeof s === 'string' && s.trim() !== '');
    return Array.from(new Set(scents)).sort();
  }, [allProducts]);

  const uniqueMaterials = useMemo(() => {
    const materials = allProducts
      .map(p => p.material)
      .filter((m): m is string => typeof m === 'string' && m.trim() !== '');
    return Array.from(new Set(materials)).sort();
  }, [allProducts]);

  const createQueryString = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.delete('category');
    selectedCategories.forEach(cat => params.append('category', cat));

    params.delete('scent');
    selectedScents.forEach(scent => params.append('scent', scent));
    
    params.delete('material');
    selectedMaterials.forEach(mat => params.append('material', mat));

    if (priceRange[0] > 0) {
      params.set('minPrice', String(priceRange[0]));
    } else {
      params.delete('minPrice');
    }
    if (priceRange[1] < 200) { 
      params.set('maxPrice', String(priceRange[1]));
    } else {
      params.delete('maxPrice');
    }
    
    return params.toString();
  }, [selectedCategories, selectedScents, selectedMaterials, priceRange, searchParams]);


  useEffect(() => {
    const newQueryString = createQueryString();
    // Debounce or delay this push if performance becomes an issue
    router.push(`/${locale}/products?${newQueryString}`, { scroll: false });
  }, [createQueryString, router, locale]);


  const handleCheckboxChange = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newList = list.includes(value)
      ? list.filter(item => item !== value)
      : [...list, value];
    setter(newList);
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = Number(value);
    if (type === 'min') {
      setMinPriceInput(value);
      if (!isNaN(numValue) && numValue >=0 && numValue <= priceRange[1]) {
        setPriceRange([numValue, priceRange[1]]);
      }
    } else {
      setMaxPriceInput(value);
      if (!isNaN(numValue) && numValue <= 200 && numValue >= priceRange[0]) {
        setPriceRange([priceRange[0], numValue]);
      }
    }
  };

  const handleSliderCommit = (newRange: [number, number]) => {
    setPriceRange(newRange);
    setMinPriceInput(String(newRange[0]));
    setMaxPriceInput(String(newRange[1]));
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedScents([]);
    setSelectedMaterials([]);
    setPriceRange([0, 200]);
    setMinPriceInput('0');
    setMaxPriceInput('200');
    const currentSearch = searchParams.get('search');
    const currentSort = searchParams.get('sort');
    let newPath = `/${locale}/products`;
    const queryParams = new URLSearchParams();
    if (currentSearch) queryParams.set('search', currentSearch);
    if (currentSort) queryParams.set('sort', currentSort);
    if (queryParams.toString()) newPath += `?${queryParams.toString()}`;
    
    router.push(newPath, { scroll: false });
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedScents.length > 0 || selectedMaterials.length > 0 || priceRange[0] > 0 || priceRange[1] < 200;


  return (
    <aside className="w-full lg:w-72 lg:sticky lg:top-24 self-start space-y-6 p-4 border border-border/60 rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{dictionary.filtersTitle}</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">
            <X className="mr-1 h-3 w-3" /> {dictionary.clearAllButton}
          </Button>
        )}
      </div>
      <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-base">{dictionary.categoryTitle}</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {categoriesData.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.slug}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => handleCheckboxChange(category.slug, selectedCategories, setSelectedCategories)}
                />
                <Label htmlFor={`cat-${category.slug}`} className="font-normal text-sm">{category.name}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-base">{dictionary.priceRangeTitle}</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-3">
            <Slider
              value={priceRange}
              min={0}
              max={200}
              step={5}
              onValueCommit={handleSliderCommit} // Use onValueCommit for final value
              onValueChange={setPriceRange} // Use onValueChange for immediate feedback to slider thumbs
              className="my-2"
            />
            <div className="flex justify-between items-center space-x-2">
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input 
                  type="number" 
                  value={minPriceInput}
                  onBlur={() => handleSliderCommit([Number(minPriceInput), priceRange[1]])}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full pl-5 h-9 text-sm"
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input 
                  type="number" 
                  value={maxPriceInput}
                  onBlur={() => handleSliderCommit([priceRange[0], Number(maxPriceInput)])}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full pl-5 h-9 text-sm"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {uniqueScents.length > 0 && (
          <AccordionItem value="scent">
            <AccordionTrigger className="text-base">{dictionary.scentTitle}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {uniqueScents.map(scent => (
                <div key={scent} className="flex items-center space-x-2">
                  <Checkbox
                    id={`scent-${scent.toLowerCase().replace(/\s+/g, '-')}`}
                    checked={selectedScents.includes(scent)}
                    onCheckedChange={() => handleCheckboxChange(scent, selectedScents, setSelectedScents)}
                  />
                  <Label htmlFor={`scent-${scent.toLowerCase().replace(/\s+/g, '-')}`} className="font-normal text-sm">{scent}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
        
        {uniqueMaterials.length > 0 && (
          <AccordionItem value="material">
            <AccordionTrigger className="text-base">{dictionary.materialTitle}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {uniqueMaterials.map(material => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material.toLowerCase().replace(/\s+/g, '-')}`}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={() => handleCheckboxChange(material, selectedMaterials, setSelectedMaterials)}
                  />
                  <Label htmlFor={`material-${material.toLowerCase().replace(/\s+/g, '-')}`} className="font-normal text-sm">{material}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </aside>
  );
}

    