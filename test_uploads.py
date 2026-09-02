#!/usr/bin/env python3
"""
Upload Endpoint Testing Script
Tests POST /api/uploads and GET /api/uploads/{filename}
"""

import requests
import io
from PIL import Image

# Base URL from frontend/.env
BASE_URL = "https://lean-deploy-9.preview.emergentagent.com/api"

# Admin credentials
ADMIN_LOGIN = "gi888"
ADMIN_PASSWORD = "Giinova2020"

# Test results tracking
test_results = []
total_tests = 0
passed_tests = 0
failed_tests = 0


def log_test(test_name: str, passed: bool, details: str = ""):
    """Log test result"""
    global total_tests, passed_tests, failed_tests
    total_tests += 1
    if passed:
        passed_tests += 1
        status = "✅ PASS"
    else:
        failed_tests += 1
        status = "❌ FAIL"
    
    result = f"{status} - {test_name}"
    if details:
        result += f"\n    Details: {details}"
    test_results.append(result)
    print(result)


def get_admin_token():
    """Get admin token for authenticated requests"""
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"login": ADMIN_LOGIN, "senha": ADMIN_PASSWORD},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            return data.get("token")
        else:
            print(f"❌ Failed to get admin token: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception getting admin token: {str(e)}")
        return None


def create_tiny_png():
    """Create a tiny valid PNG image (1x1 pixel)"""
    img = Image.new('RGB', (1, 1), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes.getvalue()


def create_oversized_fake_png():
    """Create a fake PNG file larger than 8MB"""
    # Create 9MB of data
    return b'\x89PNG\r\n\x1a\n' + (b'X' * (9 * 1024 * 1024))


def test_upload_without_auth():
    """Test 1: POST /api/uploads without Authorization header → 401"""
    test_name = "Upload Without Auth (401)"
    
    try:
        png_data = create_tiny_png()
        files = {'file': ('test.png', png_data, 'image/png')}
        response = requests.post(f"{BASE_URL}/uploads", files=files, timeout=10)
        
        if response.status_code == 401:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 401, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_upload_valid_png(token: str):
    """Test 2: Upload a small PNG with valid token → 200"""
    test_name = "Upload Valid PNG (200)"
    
    try:
        png_data = create_tiny_png()
        files = {'file': ('test.png', png_data, 'image/png')}
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.post(f"{BASE_URL}/uploads", files=files, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['url', 'filename', 'size', 'content_type']
            missing_fields = [f for f in required_fields if f not in data]
            
            if missing_fields:
                log_test(test_name, False, f"Missing fields: {missing_fields}. Response: {data}")
                return None
            
            # Validate URL format
            if not data['url'].startswith('/api/uploads/'):
                log_test(test_name, False, f"URL doesn't start with '/api/uploads/': {data['url']}")
                return None
            
            if not data['url'].endswith('.png'):
                log_test(test_name, False, f"URL doesn't end with '.png': {data['url']}")
                return None
            
            # Validate size
            if data['size'] != len(png_data):
                log_test(test_name, False, f"Size mismatch. Expected: {len(png_data)}, Got: {data['size']}")
                return None
            
            log_test(test_name, True, f"Status: {response.status_code}, URL: {data['url']}, Size: {data['size']}, Content-Type: {data['content_type']}")
            return data
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return None
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")
        return None


def test_upload_txt_file(token: str):
    """Test 3: Upload a .txt file with valid token → 400 (formato não suportado)"""
    test_name = "Upload TXT File (400 - formato não suportado)"
    
    try:
        txt_data = b"This is a test text file content"
        files = {'file': ('test.txt', txt_data, 'text/plain')}
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.post(f"{BASE_URL}/uploads", files=files, headers=headers, timeout=10)
        
        if response.status_code == 400:
            response_text = response.text.lower()
            if 'formato' in response_text or 'suportado' in response_text:
                log_test(test_name, True, f"Status: {response.status_code}, Message: {response.text}")
            else:
                log_test(test_name, False, f"Status 400 but unexpected message: {response.text}")
        else:
            log_test(test_name, False, f"Expected 400, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_upload_oversized_file(token: str):
    """Test 4: Upload an oversized file (>8MB) with valid token → 400 (limite 8MB)"""
    test_name = "Upload Oversized File (400 - limite 8MB)"
    
    try:
        oversized_data = create_oversized_fake_png()
        files = {'file': ('large.png', oversized_data, 'image/png')}
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.post(f"{BASE_URL}/uploads", files=files, headers=headers, timeout=30)
        
        if response.status_code == 400:
            response_text = response.text.lower()
            if 'grande' in response_text or '8mb' in response_text or 'limite' in response_text:
                log_test(test_name, True, f"Status: {response.status_code}, Message: {response.text}")
            else:
                log_test(test_name, False, f"Status 400 but unexpected message: {response.text}")
        else:
            log_test(test_name, False, f"Expected 400, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_get_uploaded_file(upload_data: dict):
    """Test 5: GET /api/uploads/{filename} with valid filename → 200"""
    test_name = "Get Uploaded File (200)"
    
    try:
        # Extract filename from URL (e.g., /api/uploads/abc123.png -> abc123.png)
        url = upload_data['url']
        filename = url.split('/')[-1]
        
        # Construct full URL (base URL without /api since /api is already in the URL)
        base_without_api = BASE_URL.replace('/api', '')
        full_url = f"{base_without_api}{url}"
        
        response = requests.get(full_url, timeout=10)
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            content_length = len(response.content)
            
            # Validate content-type
            if 'image/png' not in content_type:
                log_test(test_name, False, f"Expected content-type 'image/png', got '{content_type}'")
                return
            
            # Validate content length matches size field
            if content_length != upload_data['size']:
                log_test(test_name, False, f"Content length mismatch. Expected: {upload_data['size']}, Got: {content_length}")
                return
            
            log_test(test_name, True, f"Status: {response.status_code}, Content-Type: {content_type}, Size: {content_length}")
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_get_nonexistent_file():
    """Test 6: GET /api/uploads/nonexistent.png → 404"""
    test_name = "Get Nonexistent File (404)"
    
    try:
        response = requests.get(f"{BASE_URL}/uploads/nonexistent.png", timeout=10)
        
        if response.status_code == 404:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 404, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def main():
    """Run all upload tests"""
    print("=" * 80)
    print("UPLOAD ENDPOINT TESTING")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print("=" * 80)
    print()
    
    # Get admin token
    print("Getting admin token...")
    token = get_admin_token()
    if not token:
        print("\n❌ CRITICAL: Cannot proceed without valid token")
        return
    print(f"✅ Token obtained\n")
    
    # Test 1: Upload without auth
    test_upload_without_auth()
    
    # Test 2: Upload valid PNG
    upload_data = test_upload_valid_png(token)
    
    # Test 3: Upload TXT file
    test_upload_txt_file(token)
    
    # Test 4: Upload oversized file
    test_upload_oversized_file(token)
    
    # Test 5: Get uploaded file (only if upload succeeded)
    if upload_data:
        test_get_uploaded_file(upload_data)
    else:
        print("⚠️  Skipping Test 5 (Get Uploaded File) - no valid upload data")
    
    # Test 6: Get nonexistent file
    test_get_nonexistent_file()
    
    # Print summary
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests} ✅")
    print(f"Failed: {failed_tests} ❌")
    print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
    print("=" * 80)
    
    if failed_tests > 0:
        print("\n❌ FAILED TESTS:")
        for result in test_results:
            if "❌ FAIL" in result:
                print(result)
    
    print("\n" + "=" * 80)


if __name__ == "__main__":
    main()
