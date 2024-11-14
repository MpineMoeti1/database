// src/components/ProductPieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ProductPieChart = ({ products }) => {
    const data = {
        labels: products.map(product => product.name), // Product names
        datasets: [
            {
                label: 'Product Quantity',
                data: products.map(product => product.quantity), // Corresponding quantities
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Product Quantities',
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return <Pie data={data} options={options} />;
};

export default ProductPieChart;