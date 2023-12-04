// to calculate GPA and  GRADE based on marks
const calculateGradeAndGPA = marksOutOf100 => {
  const percentage = (marksOutOf100 / 100) * 100
  let grade = ""
  let gpa = 0.0

  if (percentage >= 90) {
    grade = "S"
    gpa = 10.0
  } else if (percentage >= 85) {
    grade = "A+"
    gpa = 9.0
  } else if (percentage >= 80) {
    grade = "A"
    gpa = 8.5
  } else if (percentage >= 75) {
    grade = "B+"
    gpa = 8.0
  } else if (percentage >= 70) {
    grade = "B"
    gpa = 7.5
  } else if (percentage >= 65) {
    grade = "C+"
    gpa = 7.0
  } else if (percentage >= 60) {
    grade = "C"
    gpa = 6.5
  } else if (percentage >= 55) {
    grade = "D"
    gpa = 6.0
  } else if (percentage >= 50) {
    grade = "P"
    gpa = 5.5
  } else {
    grade = "F"
    gpa = 0.0
  }

  return { grade, gpa, percentage }
}

const calculateAge = dateOfBirth => {
  const currentDate = new Date()

  const dob = new Date(dateOfBirth)

  const age = currentDate.getFullYear() - dob.getFullYear()

  const hasBirthdayOccurred =
    currentDate.getMonth() > dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() &&
      currentDate.getDate() >= dob.getDate())

  if (!hasBirthdayOccurred) {
    return age - 1
  }

  return age
}

const isStorybrainEmail = email => {
  const storybrainRegex = /@storybrain\.(com|io)$/

  return storybrainRegex.test(email)
}

// const isStorybrainEmail = email => {
//   const storybrainRegex = /vishnu(?=.*@)/

//   return storybrainRegex.test(email)
// }

module.exports = { calculateGradeAndGPA, calculateAge, isStorybrainEmail }
