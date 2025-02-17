import requests

def test_supplier_assessment():
    url = "http://localhost:5000/assess-supplier"
    
    test_data = {
        "name": "Test Supplier",
        "financial": {
            "credit_score": 750,
            "payment_history": 95,
            "debt_ratio": 0.3,
            "liquidity_ratio": 1.5
        },
        "operational": {
            "on_time_delivery": 92,
            "capacity_utilization": 75,
            "geographic_risk": 85,
            "supply_chain_redundancy": 80
        },
        "quality": {
            "defect_rate": 2,
            "gmp_compliance": 95,
            "quality_certifications": 90,
            "batch_success_rate": 98
        },
        "compliance": {
            "regulatory_standing": 95,
            "audit_results": 88,
            "documentation_compliance": 92
        }
    }

    response = requests.post(url, json=test_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_supplier_assessment() 