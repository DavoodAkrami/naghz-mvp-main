export const pythonLearning = [
    {
      id: "1",
      type: "text" as const,
      header: "آشنایی با پایتون",
      text: "پایتون یک زبان برنامه‌نویسی سطح بالا و همه‌منظوره است که به خاطر سادگی و خوانایی کد، محبوبیت زیادی دارد.",
      pageLength: 3,
    },
    {
      id: "2",
      type: "test" as const,
      question: "کدام یک از موارد زیر زبان برنامه‌نویسی است؟",
      testGrid: "col" as const,
      options: [
        { id: 1, text: "پایتون", isCorrect: true },
        { id: 2, text: "HTML", isCorrect: false },
        { id: 3, text: "CSS", isCorrect: false },
      ],
      correctAnswer: 1,
      pageLength: 3,
    },
    {
      id: "3",
      type: "text" as const,
      header: "کاربردهای پایتون",
      text: "پایتون در زمینه‌هایی مانند توسعه وب، یادگیری ماشین، اتوماسیون، و تحلیل داده کاربرد دارد.",
      pageLength: 3,
    },
  ];

  
export default pythonLearning;