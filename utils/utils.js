// to calculate GPA and  GRADE based on marks
const calculateGradeAndGPA = marksOutOf100 => {
  const percentage = (marksOutOf100 / 100) * 100
  let grade = ""
  let gpa = 0.0

  if (percentage >= 90) {
    grade = "S"
    gpa = 10.0
  } else if (percentage >= 85 && percentage < 90) {
    grade = "A+"
    gpa = 9.0
  } else if (percentage >= 80 && percentage < 85) {
    grade = "A"
    gpa = 8.5
  } else if (percentage >= 75 && percentage < 80) {
    grade = "B+"
    gpa = 8.0
  } else if (percentage >= 70 && percentage < 75) {
    grade = "B"
    gpa = 7.5
  } else if (percentage >= 65 && percentage < 70) {
    grade = "C+"
    gpa = 7.0
  } else if (percentage >= 60 && percentage < 65) {
    grade = "C"
    gpa = 6.5
  } else if (percentage >= 55 && percentage < 60) {
    grade = "D"
    gpa = 6.0
  } else if (percentage >= 50 && percentage < 55) {
    grade = "P"
    gpa = 5.5
  } else {
    grade = "F"
    gpa = 0.0
  }

  return { grade, gpa, percentage }
}

module.exports = calculateGradeAndGPA
