#!/usr/bin/env python3
"""
Backend API Testing Script for Blog Article Endpoints
Tests all CRUD operations and authentication flows
"""

import requests
import json
from typing import Dict, Any, Optional

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


def test_admin_login_wrong_credentials():
    """Test 1: POST /api/admin/login with wrong credentials"""
    test_name = "Admin Login - Wrong Credentials (401)"
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"login": "wrong", "senha": "wrong"},
            timeout=10
        )
        
        if response.status_code == 401:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 401, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_admin_login_correct_credentials() -> Optional[str]:
    """Test 2: POST /api/admin/login with correct credentials"""
    test_name = "Admin Login - Correct Credentials (200)"
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"login": ADMIN_LOGIN, "senha": ADMIN_PASSWORD},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and data["token"]:
                log_test(test_name, True, f"Status: {response.status_code}, Token received")
                return data["token"]
            else:
                log_test(test_name, False, f"Status 200 but no token in response: {data}")
                return None
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return None
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")
        return None


def test_admin_verify_no_auth():
    """Test 3: GET /api/admin/verify without Authorization header"""
    test_name = "Admin Verify - No Authorization Header (401)"
    
    try:
        response = requests.get(f"{BASE_URL}/admin/verify", timeout=10)
        
        if response.status_code == 401:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 401, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_admin_verify_wrong_token():
    """Test 4: GET /api/admin/verify with wrong token"""
    test_name = "Admin Verify - Wrong Token (401)"
    
    try:
        headers = {"Authorization": "Bearer wrong_token_12345"}
        response = requests.get(f"{BASE_URL}/admin/verify", headers=headers, timeout=10)
        
        if response.status_code == 401:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 401, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_admin_verify_valid_token(token: str):
    """Test 5: GET /api/admin/verify with valid token"""
    test_name = "Admin Verify - Valid Token (200)"
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/admin/verify", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test(test_name, True, f"Status: {response.status_code}, Response: {data}")
            else:
                log_test(test_name, False, f"Status 200 but unexpected response: {data}")
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_get_articles_public():
    """Test 6: GET /api/articles (public, no auth required)"""
    test_name = "Get Articles - Public Access (200)"
    
    try:
        response = requests.get(f"{BASE_URL}/articles", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test(test_name, True, f"Status: {response.status_code}, Articles count: {len(data)}")
            else:
                log_test(test_name, False, f"Expected list, got: {type(data)}")
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_create_article_no_auth():
    """Test 7: POST /api/articles without token"""
    test_name = "Create Article - No Auth (401)"
    
    try:
        payload = {
            "title": "Test Article",
            "excerpt": "Test excerpt",
            "content": "Test content",
            "category": "Test",
            "read_time": "3 min"
        }
        response = requests.post(f"{BASE_URL}/articles", json=payload, timeout=10)
        
        if response.status_code == 401:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 401, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_create_article_with_auth(token: str) -> Optional[Dict[str, Any]]:
    """Test 8: POST /api/articles with valid token"""
    test_name = "Create Article - With Auth (200)"
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "title": "Artigo de Teste Backend",
            "excerpt": "resumo",
            "content": "# Título\n\nParagrafo.",
            "category": "Testes",
            "read_time": "3 min"
        }
        response = requests.post(f"{BASE_URL}/articles", json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "slug", "title", "created_at", "updated_at"]
            missing_fields = [f for f in required_fields if f not in data]
            
            if not missing_fields:
                # Check if slug is auto-generated from title (kebab-case with accents stripped)
                expected_slug = "artigo-de-teste-backend"
                if data["slug"] == expected_slug:
                    log_test(test_name, True, f"Status: {response.status_code}, Article created with slug: {data['slug']}")
                    return data
                else:
                    log_test(test_name, False, f"Slug mismatch. Expected: {expected_slug}, Got: {data['slug']}")
                    return data
            else:
                log_test(test_name, False, f"Missing fields: {missing_fields}. Response: {data}")
                return None
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return None
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")
        return None


def test_get_article_by_slug(slug: str):
    """Test 9: GET /api/articles/{slug} with valid slug"""
    test_name = f"Get Article by Slug - Valid Slug (200)"
    
    try:
        response = requests.get(f"{BASE_URL}/articles/{slug}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("slug") == slug and data.get("title") == "Artigo de Teste Backend":
                log_test(test_name, True, f"Status: {response.status_code}, Article retrieved with correct title")
            else:
                log_test(test_name, False, f"Article data mismatch: {data}")
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_get_article_by_invalid_slug():
    """Test 10: GET /api/articles/{slug} with invalid slug"""
    test_name = "Get Article by Slug - Invalid Slug (404)"
    
    try:
        response = requests.get(f"{BASE_URL}/articles/non-existent-slug-12345", timeout=10)
        
        if response.status_code == 404:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 404, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_create_article_duplicate_title(token: str) -> Optional[str]:
    """Test 11: POST /api/articles with same title (slug uniqueness)"""
    test_name = "Create Article - Duplicate Title (Slug Uniqueness)"
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "title": "Artigo de Teste Backend",
            "excerpt": "resumo 2",
            "content": "# Título 2\n\nParagrafo 2.",
            "category": "Testes",
            "read_time": "3 min"
        }
        response = requests.post(f"{BASE_URL}/articles", json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            # Slug should be different (with suffix -2)
            expected_slug = "artigo-de-teste-backend-2"
            if data["slug"] == expected_slug:
                log_test(test_name, True, f"Status: {response.status_code}, Unique slug generated: {data['slug']}")
                return data["slug"]
            else:
                log_test(test_name, False, f"Expected slug: {expected_slug}, Got: {data['slug']}")
                return data["slug"]
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return None
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")
        return None


def test_update_article_no_auth(article_id: str):
    """Test 12: PUT /api/articles/{id} without token"""
    test_name = "Update Article - No Auth (401)"
    
    try:
        payload = {"title": "Updated Title"}
        response = requests.put(f"{BASE_URL}/articles/{article_id}", json=payload, timeout=10)
        
        if response.status_code == 401:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 401, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_update_article_with_auth(token: str, article_id: str) -> Optional[str]:
    """Test 13: PUT /api/articles/{id} with valid token"""
    test_name = "Update Article - With Auth (200)"
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "title": "Artigo Atualizado",
            "content": "# Título Atualizado\n\nConteúdo atualizado."
        }
        response = requests.put(f"{BASE_URL}/articles/{article_id}", json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("title") == "Artigo Atualizado":
                log_test(test_name, True, f"Status: {response.status_code}, Article updated successfully")
                return data.get("slug")
            else:
                log_test(test_name, False, f"Title not updated correctly: {data}")
                return None
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
            return None
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")
        return None


def test_verify_article_update(slug: str):
    """Test 14: Verify article update by fetching by slug"""
    test_name = "Verify Article Update - Fetch by Slug"
    
    try:
        response = requests.get(f"{BASE_URL}/articles/{slug}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("title") == "Artigo Atualizado":
                log_test(test_name, True, f"Status: {response.status_code}, Update verified")
            else:
                log_test(test_name, False, f"Title mismatch after update: {data.get('title')}")
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_delete_article_no_auth(article_id: str):
    """Test 15: DELETE /api/articles/{id} without token"""
    test_name = "Delete Article - No Auth (401)"
    
    try:
        response = requests.delete(f"{BASE_URL}/articles/{article_id}", timeout=10)
        
        if response.status_code == 401:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 401, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_delete_article_with_auth(token: str, article_id: str):
    """Test 16: DELETE /api/articles/{id} with valid token"""
    test_name = "Delete Article - With Auth (200)"
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.delete(f"{BASE_URL}/articles/{article_id}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                log_test(test_name, True, f"Status: {response.status_code}, Article deleted")
            else:
                log_test(test_name, False, f"Unexpected response: {data}")
        else:
            log_test(test_name, False, f"Expected 200, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def test_delete_article_again(token: str, article_id: str):
    """Test 17: DELETE /api/articles/{id} again (should return 404)"""
    test_name = "Delete Article - Second Delete (404)"
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.delete(f"{BASE_URL}/articles/{article_id}", headers=headers, timeout=10)
        
        if response.status_code == 404:
            log_test(test_name, True, f"Status: {response.status_code}")
        else:
            log_test(test_name, False, f"Expected 404, got {response.status_code}. Response: {response.text}")
    except Exception as e:
        log_test(test_name, False, f"Exception: {str(e)}")


def main():
    """Run all tests"""
    print("=" * 80)
    print("BACKEND API TESTING - Blog Article Endpoints")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print("=" * 80)
    print()
    
    # Test 1: Wrong credentials
    test_admin_login_wrong_credentials()
    
    # Test 2: Correct credentials
    token = test_admin_login_correct_credentials()
    if not token:
        print("\n❌ CRITICAL: Cannot proceed without valid token")
        return
    
    # Test 3-5: Admin verify
    test_admin_verify_no_auth()
    test_admin_verify_wrong_token()
    test_admin_verify_valid_token(token)
    
    # Test 6: Get articles (public)
    test_get_articles_public()
    
    # Test 7-8: Create article
    test_create_article_no_auth()
    article = test_create_article_with_auth(token)
    if not article:
        print("\n❌ CRITICAL: Cannot proceed without created article")
        return
    
    article_id = article["id"]
    article_slug = article["slug"]
    
    # Test 9-10: Get article by slug
    test_get_article_by_slug(article_slug)
    test_get_article_by_invalid_slug()
    
    # Test 11: Create article with duplicate title
    duplicate_slug = test_create_article_duplicate_title(token)
    
    # Test 12-14: Update article
    test_update_article_no_auth(article_id)
    updated_slug = test_update_article_with_auth(token, article_id)
    if updated_slug:
        test_verify_article_update(updated_slug)
    
    # Test 15-17: Delete article
    test_delete_article_no_auth(article_id)
    test_delete_article_with_auth(token, article_id)
    test_delete_article_again(token, article_id)
    
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
