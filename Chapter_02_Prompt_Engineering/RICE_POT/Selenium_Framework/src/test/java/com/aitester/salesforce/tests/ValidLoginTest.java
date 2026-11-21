package com.aitester.salesforce.tests;

import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.Test;

import com.aitester.salesforce.base.BaseTest;
import com.aitester.salesforce.pages.LoginPage;

import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;

@Epic("Salesforce Authentication")
@Feature("Login")
public class ValidLoginTest extends BaseTest {

    @Test(priority = 1, description = "Valid credentials authenticate the user and leave the login page")
    @Story("Valid credentials")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Login with valid credentials and verify the user is redirected away from the login page without an error")
    public void verifyLoginWithValidCredentials() {
        String username = getConfig("valid.username");
        String password = getConfig("valid.password");
        ensureCredentialsConfigured(username, password);

        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.selectRememberMe();
            loginPage.doLogin(username, password);

            Assert.assertFalse(loginPage.isErrorMessageDisplayed(), "An error was displayed for valid credentials");
            Assert.assertFalse(loginPage.getCurrentUrl().contains("login.salesforce.com"),
                    "The user was not redirected away from the login page after a valid login");
        } catch (SkipException e) {
            throw e;
        } catch (AssertionError e) {
            throw e;
        } catch (RuntimeException e) {
            throw new IllegalStateException("Valid login verification failed: " + e.getMessage(), e);
        }
    }

    private void ensureCredentialsConfigured(String username, String password) {
        if (username.startsWith("REPLACE_") || password.startsWith("REPLACE_")) {
            throw new SkipException("Set valid.username and valid.password in config.properties to run the valid login test");
        }
    }
}
