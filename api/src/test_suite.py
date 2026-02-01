"""
Comprehensive API Testing Script
Run this after starting the API server
"""

import requests
import json
from datetime import datetime

# API Base URL
BASE_URL = "http://localhost:8000"

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name: str):
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"Testing: {name}")
    print(f"{'='*60}{Colors.END}")

def print_success(message: str):
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message: str):
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_info(message: str):
    print(f"{Colors.YELLOW}ℹ {message}{Colors.END}")

# Test Data
test_ngo_user = {
    "email": f"test_ngo_{datetime.now().timestamp()}@example.com",
    "password": "password123",
    "name": "Test NGO Organization",
    "user_type": "NGO"
}

test_adopter_user = {
    "email": f"test_adopter_{datetime.now().timestamp()}@example.com",
    "password": "password123",
    "name": "Test Adopter",
    "user_type": "Adopter"
}

# Store tokens
ngo_token = None
adopter_token = None
ngo_user_id = None
test_pet_id = None

def test_health_check():
    """Test 1: Health Check"""
    print_test("Health Check Endpoint")
    try:
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
        data = response.json()
        print_success(f"API Status: {data['status']}")
        print_info(f"Message: {data['message']}")
        return True
    except Exception as e:
        print_error(f"Health check failed: {e}")
        return False

def test_ngo_signup():
    """Test 2: NGO Signup"""
    print_test("NGO Signup")
    global ngo_token, ngo_user_id
    try:
        response = requests.post(
            f"{BASE_URL}/api/signup",
            json=test_ngo_user
        )
        assert response.status_code == 200
        data = response.json()
        ngo_token = data['token']
        ngo_user_id = data['user']['id']
        print_success(f"NGO User Created: {data['user']['name']}")
        print_info(f"User ID: {ngo_user_id}")
        print_info(f"Email: {data['user']['email']}")
        print_info(f"User Type: {data['user']['user_type']}")
        print_info(f"Token: {ngo_token[:20]}...")
        return True
    except Exception as e:
        print_error(f"NGO signup failed: {e}")
        if response.status_code != 200:
            print_error(f"Response: {response.text}")
        return False

def test_adopter_signup():
    """Test 3: Adopter Signup"""
    print_test("Adopter Signup")
    global adopter_token
    try:
        response = requests.post(
            f"{BASE_URL}/api/signup",
            json=test_adopter_user
        )
        assert response.status_code == 200
        data = response.json()
        adopter_token = data['token']
        print_success(f"Adopter Created: {data['user']['name']}")
        print_info(f"User ID: {data['user']['id']}")
        print_info(f"Token: {adopter_token[:20]}...")
        return True
    except Exception as e:
        print_error(f"Adopter signup failed: {e}")
        return False

def test_duplicate_signup():
    """Test 4: Duplicate Email Signup (Should Fail)"""
    print_test("Duplicate Email Signup (Should Fail)")
    try:
        response = requests.post(
            f"{BASE_URL}/api/signup",
            json=test_ngo_user
        )
        assert response.status_code == 400
        print_success("Duplicate email properly rejected")
        print_info(f"Error message: {response.json()['detail']}")
        return True
    except Exception as e:
        print_error(f"Duplicate signup test failed: {e}")
        return False

def test_login():
    """Test 5: Login"""
    print_test("Login with NGO Credentials")
    try:
        response = requests.post(
            f"{BASE_URL}/api/login",
            json={
                "email": test_ngo_user["email"],
                "password": test_ngo_user["password"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        print_success("Login successful")
        print_info(f"Token matches: {data['token'] == ngo_token}")
        return True
    except Exception as e:
        print_error(f"Login failed: {e}")
        return False

def test_invalid_login():
    """Test 6: Invalid Login (Should Fail)"""
    print_test("Invalid Login (Should Fail)")
    try:
        response = requests.post(
            f"{BASE_URL}/api/login",
            json={
                "email": test_ngo_user["email"],
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        print_success("Invalid credentials properly rejected")
        print_info(f"Error: {response.json()['detail']}")
        return True
    except Exception as e:
        print_error(f"Invalid login test failed: {e}")
        return False

def test_get_current_user():
    """Test 7: Get Current User Info"""
    print_test("Get Current User (/api/me)")
    try:
        response = requests.get(
            f"{BASE_URL}/api/me",
            headers={"Authorization": f"Bearer {ngo_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        print_success("User info retrieved")
        print_info(f"Name: {data['name']}")
        print_info(f"Email: {data['email']}")
        print_info(f"Type: {data['user_type']}")
        return True
    except Exception as e:
        print_error(f"Get current user failed: {e}")
        return False

def test_unauthorized_access():
    """Test 8: Unauthorized Access (Should Fail)"""
    print_test("Unauthorized Access (Should Fail)")
    try:
        response = requests.get(f"{BASE_URL}/api/me")
        assert response.status_code == 401
        print_success("Unauthorized access properly rejected")
        return True
    except Exception as e:
        print_error(f"Unauthorized access test failed: {e}")
        return False

def test_create_pet():
    """Test 9: Create Pet (NGO Only)"""
    print_test("Create Pet Listing")
    global test_pet_id
    try:
        pet_data = {
            "name": "Test Buddy",
            "type": "Dog",
            "age": 3,
            "location": "Test City, TC",
            "image_url": "https://images.unsplash.com/photo-1633722715463-d30628519b65?w=500&h=500&fit=crop",
            "vaccinated": True,
            "neutered": True,
            "medical_notes": "Friendly test dog"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/pets",
            json=pet_data,
            headers={"Authorization": f"Bearer {ngo_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        test_pet_id = data['id']
        print_success(f"Pet created: {data['name']}")
        print_info(f"Pet ID: {test_pet_id}")
        print_info(f"Type: {data['type']}")
        print_info(f"Age: {data['age']} years")
        return True
    except Exception as e:
        print_error(f"Create pet failed: {e}")
        if response.status_code != 200:
            print_error(f"Response: {response.text}")
        return False

def test_adopter_create_pet():
    """Test 10: Adopter Tries to Create Pet (Should Fail)"""
    print_test("Adopter Creates Pet (Should Fail)")
    try:
        pet_data = {
            "name": "Should Fail",
            "type": "Cat",
            "age": 2,
            "location": "Test",
            "image_url": "https://example.com/test.jpg",
            "vaccinated": True,
            "neutered": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/pets",
            json=pet_data,
            headers={"Authorization": f"Bearer {adopter_token}"}
        )
        assert response.status_code == 403
        print_success("Adopter properly blocked from creating pets")
        print_info(f"Error: {response.json()['detail']}")
        return True
    except Exception as e:
        print_error(f"Adopter create pet test failed: {e}")
        return False

def test_get_pets():
    """Test 11: Get All Pets (Public)"""
    print_test("Get All Pets")
    try:
        response = requests.get(f"{BASE_URL}/api/pets")
        assert response.status_code == 200
        data = response.json()
        print_success(f"Retrieved {len(data['pets'])} pets")
        print_info(f"Total: {data['total']}")
        print_info(f"Page: {data['page']}")
        if data['pets']:
            print_info(f"First pet: {data['pets'][0]['name']}")
        return True
    except Exception as e:
        print_error(f"Get pets failed: {e}")
        return False

def test_get_pet_details():
    """Test 12: Get Specific Pet Details"""
    print_test("Get Pet Details")
    try:
        response = requests.get(f"{BASE_URL}/api/pets/{test_pet_id}")
        assert response.status_code == 200
        data = response.json()
        print_success(f"Retrieved pet: {data['name']}")
        print_info(f"NGO: {data.get('ngo_name', 'Unknown')}")
        print_info(f"Location: {data['location']}")
        return True
    except Exception as e:
        print_error(f"Get pet details failed: {e}")
        return False

def test_filter_pets():
    """Test 13: Filter Pets by Type"""
    print_test("Filter Pets by Type")
    try:
        response = requests.get(f"{BASE_URL}/api/pets?type=Dog")
        assert response.status_code == 200
        data = response.json()
        print_success(f"Found {len(data['pets'])} dogs")
        return True
    except Exception as e:
        print_error(f"Filter pets failed: {e}")
        return False

def test_ngo_dashboard():
    """Test 14: NGO Dashboard"""
    print_test("NGO Dashboard")
    try:
        response = requests.get(
            f"{BASE_URL}/api/ngo/dashboard",
            headers={"Authorization": f"Bearer {ngo_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        print_success("Dashboard data retrieved")
        print_info(f"Total pets: {data['stats']['total_pets']}")
        print_info(f"Recent pets: {len(data['recent_pets'])}")
        return True
    except Exception as e:
        print_error(f"NGO dashboard failed: {e}")
        return False

def test_adopter_dashboard():
    """Test 15: Adopter Dashboard Access (Should Fail)"""
    print_test("Adopter Dashboard Access (Should Fail)")
    try:
        response = requests.get(
            f"{BASE_URL}/api/ngo/dashboard",
            headers={"Authorization": f"Bearer {adopter_token}"}
        )
        assert response.status_code == 403
        print_success("Adopter properly blocked from NGO dashboard")
        return True
    except Exception as e:
        print_error(f"Adopter dashboard test failed: {e}")
        return False

def test_logout():
    """Test 16: Logout"""
    print_test("Logout")
    try:
        response = requests.post(
            f"{BASE_URL}/api/logout",
            headers={"Authorization": f"Bearer {ngo_token}"}
        )
        assert response.status_code == 200
        print_success("Logout successful")
        
        # Try to use the token after logout (should fail)
        response2 = requests.get(
            f"{BASE_URL}/api/me",
            headers={"Authorization": f"Bearer {ngo_token}"}
        )
        assert response2.status_code == 401
        print_success("Token invalidated after logout")
        return True
    except Exception as e:
        print_error(f"Logout failed: {e}")
        return False

def run_all_tests():
    """Run all tests in sequence"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"🚀 Starting Comprehensive API Tests")
    print(f"{'='*60}{Colors.END}\n")
    
    tests = [
        test_health_check,
        test_ngo_signup,
        test_adopter_signup,
        test_duplicate_signup,
        test_login,
        test_invalid_login,
        test_get_current_user,
        test_unauthorized_access,
        test_create_pet,
        test_adopter_create_pet,
        test_get_pets,
        test_get_pet_details,
        test_filter_pets,
        test_ngo_dashboard,
        test_adopter_dashboard,
        test_logout,
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append((test.__doc__, result))
        except Exception as e:
            print_error(f"Test crashed: {e}")
            results.append((test.__doc__, False))
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"📊 Test Summary")
    print(f"{'='*60}{Colors.END}\n")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = f"{Colors.GREEN}✓ PASS{Colors.END}" if result else f"{Colors.RED}✗ FAIL{Colors.END}"
        print(f"{status} - {test_name}")
    
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    percentage = (passed / total) * 100
    color = Colors.GREEN if percentage == 100 else Colors.YELLOW if percentage >= 75 else Colors.RED
    print(f"{color}Results: {passed}/{total} tests passed ({percentage:.1f}%){Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")

if __name__ == "__main__":
    print(f"\n{Colors.YELLOW}Make sure the API is running on {BASE_URL}{Colors.END}\n")
    input("Press Enter to start tests...")
    run_all_tests()