let data = [
  {
      "id": 1,
      "content": " ____ John found Maria hard to get along with, he did the best he could",
      "quiz": 1,
      "dateAdded": "2021-10-19T09:00:02.000Z",
      "lastUpdated": "2021-10-19T09:00:02.000Z",
      "marks": 5
  },
  {
      "id": 2,
      "content": " He was forced to declare ____ two years after purchasing the property because he couldn't make payments",
      "quiz": 1,
      "dateAdded": "2021-10-19T09:50:29.000Z",
      "lastUpdated": "2021-10-19T09:50:29.000Z",
      "marks": 5
  },
  {
      "id": 3,
      "content": " Even though Cabrera Pictures and Marcella Images make very different films, ..... are successful movie studios.",
      "quiz": 1,
      "dateAdded": "2021-10-20T00:05:49.000Z",
      "lastUpdated": "2021-10-20T00:05:49.000Z",
      "marks": 5
  }
]


let question = [];
answers = [
  { id: 9, content: 'both' },     
  { id: 10, content: 'some' },    
  { id: 11, content: 'everybody' },
  { id: 12, content: 'several' }  
]
 data.map(v => {
  question.push({id: v.id,content: v.content, aswers: a})
})
console.log(question)