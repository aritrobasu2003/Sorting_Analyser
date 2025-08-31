# TODO: Fix Sorting Analyzer Code

## Issues Identified

1. **algorithms.js**:

   - Typo: "comapre" -> "compare"
   - Scoping issue: find_and_compare and find_and_swap reference global 'arr'
   - Typo: "poviot" -> "pivot"
   - In mergeSort, incorrect use of find_and_compare/find_and_swap

2. **sketch.js**:

   - Duplicate setup() function (invalid)
   - Console.log spam in draw_arr()
   - Inefficient sorting in setup_arr()
   - Potential canvas resizing bugs

3. **timer_algos.js**:
   - Similar typos and scoping issues
   - mergeSort_t calls undefined mergeSort
   - merge function doesn't assign concat result
   - Unreachable return in \_quickSortLomuto

## Plan

- [x] Fix duplicate setup() in sketch.js
- [x] Fix scoping and typos in algorithms.js
- [x] Fix mergeSort_t and merge in timer_algos.js
- [x] Remove console.log spam
- [ ] Test the fixes by running the app
