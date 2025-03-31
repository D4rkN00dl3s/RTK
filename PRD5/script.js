function fetchDataAndSave(family) {
    const apiUrl = `https://www.fruityvice.com/api/fruit/family/${family}`;
    const proxyUrl = 'https://corsproxy.io/';

    fetch(proxyUrl + apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = family + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchAndCompareFamilies(family1, family2) {
    const proxyUrl = 'https://corsproxy.io/';
    const apiUrl1 = `https://www.fruityvice.com/api/fruit/family/${family1}`;
    const apiUrl2 = `https://www.fruityvice.com/api/fruit/family/${family2}`;

    Promise.all([
        fetch(proxyUrl + apiUrl1).then(res => res.json()),
        fetch(proxyUrl + apiUrl2).then(res => res.json())
    ])
    .then(([data1, data2]) => {
        const mostNutritious1 = getMostNutritiousFruit(data1);
        const mostNutritious2 = getMostNutritiousFruit(data2);

        const avgNutrition1 = calculateAverageNutrition(data1);
        const avgNutrition2 = calculateAverageNutrition(data2);

        const comparison1 = compareNutrition(mostNutritious1.nutritions, avgNutrition1);
        const comparison2 = compareNutrition(mostNutritious2.nutritions, avgNutrition2);

        const resultText = `Most Nutritious Fruits:\n\n` +
            `Family: ${family1}\n${formatFruit(mostNutritious1)}\n\n` +
            `Family: ${family2}\n${formatFruit(mostNutritious2)}\n\n` +
            `Average Nutrition Facts:\n\n` +
            `Family: ${family1}\n${formatNutrition(avgNutrition1)}\n\n` +
            `Family: ${family2}\n${formatNutrition(avgNutrition2)}\n\n` +
            `Comparison Between Most Nutritious and Average Nutrition:\n\n` +
            `Family: ${family1}\n${comparison1}\n\n` +
            `Family: ${family2}\n${comparison2}`;

        document.getElementById('floatingTextarea').value = resultText;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('floatingTextarea').value = 'Failed to load data';
    });
}

function getMostNutritiousFruit(fruitList) {
    return fruitList.reduce((max, fruit) => {
        const totalNutrition = fruit.nutritions.calories + fruit.nutritions.fat + fruit.nutritions.sugar +
                               fruit.nutritions.carbohydrates + fruit.nutritions.protein;
        const maxNutrition = max.nutritions.calories + max.nutritions.fat + max.nutritions.sugar +
                             max.nutritions.carbohydrates + max.nutritions.protein;
        return totalNutrition > maxNutrition ? fruit : max;
    });
}

function calculateAverageNutrition(fruitList) {
    const total = fruitList.reduce((sum, fruit) => {
        sum.calories += fruit.nutritions.calories;
        sum.fat += fruit.nutritions.fat;
        sum.sugar += fruit.nutritions.sugar;
        sum.carbohydrates += fruit.nutritions.carbohydrates;
        sum.protein += fruit.nutritions.protein;
        return sum;
    }, { calories: 0, fat: 0, sugar: 0, carbohydrates: 0, protein: 0 });

    const count = fruitList.length;
    return {
        calories: (total.calories / count).toFixed(2),
        fat: (total.fat / count).toFixed(2),
        sugar: (total.sugar / count).toFixed(2),
        carbohydrates: (total.carbohydrates / count).toFixed(2),
        protein: (total.protein / count).toFixed(2)
    };
}

function compareNutrition(mostNutritious, average) {
    const labels = ["Calories", "Fats", "Sugar", "Carbs", "Protein"];
    const mostValues = [mostNutritious.calories, mostNutritious.fat, mostNutritious.sugar, mostNutritious.carbohydrates, mostNutritious.protein];
    const avgValues = [average.calories, average.fat, average.sugar, average.carbohydrates, average.protein];

    return labels.map((label, index) => {
        return `${label.padEnd(12)}: ${mostValues[index].toString().padEnd(8)} Average: ${avgValues[index].toString().padEnd(8)} Difference: ${(mostValues[index] - avgValues[index]).toFixed(2)}`;
    }).join('\n');
}

function formatFruit(fruit) {
    return `Name: ${fruit.name}\n` +
           `Calories: ${fruit.nutritions.calories}\n` +
           `Fat: ${fruit.nutritions.fat}\n` +
           `Sugar: ${fruit.nutritions.sugar}\n` +
           `Carbohydrates: ${fruit.nutritions.carbohydrates}\n` +
           `Protein: ${fruit.nutritions.protein}`;
}

function formatNutrition(nutrition) {
    return `Calories: ${nutrition.calories}\n` +
           `Fat: ${nutrition.fat}\n` +
           `Sugar: ${nutrition.sugar}\n` +
           `Carbohydrates: ${nutrition.carbohydrates}\n` +
           `Protein: ${nutrition.protein}`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showResultButton').addEventListener('click', function() {
        const family1 = document.getElementById('familySelect1').value;
        const family2 = document.getElementById('familySelect2').value;
        fetchAndCompareFamilies(family1, family2);
    });
    document.getElementById('fetchButton1').addEventListener('click', function() {
        const family1 = document.getElementById('familySelect1').value;
        fetchDataAndSave(family1);
    });
    document.getElementById('fetchButton2').addEventListener('click', function() {
        const family2 = document.getElementById('familySelect2').value;
        fetchDataAndSave(family2);
    });
});