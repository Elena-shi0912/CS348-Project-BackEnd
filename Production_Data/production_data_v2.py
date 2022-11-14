import sys
import csv
import uuid
import namegenerator
import string
import random
from datetime import datetime

USER_DB_SIZE = 100
DRIVER_DB_SIZE = 50
POSTING_DB_SIZE = 200
RIDE_DB_SIZE = 400
REVIEW_DB_SIZE = 200
CAR_DB_SIZE = 50

PASSWORD_MAX_LEN = 15
PHONE_LEN = 10
EMAIL_MAX_LEN = 12
LICENSE_NUMBER_MAX_LEN = 15
YEAR_MAX_LEN = 2

USER_DB_HEADER = ['email', 'password', 'is_driver']
USER_PROFILE_DB_HEADER = ['user_email', 'user_name', 'phone_number']
DRIVER_PROFILE_DB_HEADER = ['driver_email', 'user_name', 'phone_number', 'rating']
# DRIVER_DB_HEADER = ['driver_id', 'driver_name', 'password', 'license_number',
#                     'year_of_driving', 'phone_number', 'email']
PROVIDE_CARPOOL_DB_HEADER = ['driver_email', 'post_id']
POSTING_DB_HEADER = ['post_id', 'pickup_location', 'dropoff_location',
                     'pickup_time', 'seats_available', 'price_per_seat',
                     'additional_info']
RIDE_DB_HEADER = ['ride_id, post_id, user_email']
REVIEW_DB_HEADER = ['ride_id', 'rating', 'comment', 'comment_time', 'driver_email']
# CAR_DB_HEADER = ['car_id', 'driver_id', 'car_maker', 'car_color', 'car_model',
#                  'year_of_car', 'car_plate_number']

USER_EMAIL = []
USER_NAME = []
DRIVER_EMAIL = []
DRIVER_NAME = []
POST_ID = []
RIDE_ID = []
Post_Driver = {}
Ride_Post = {}


def random_string(len):
    return ''.join(random.choice(string.ascii_letters) for _ in range(len))


def random_number_str(len):
    return ''.join(random.choice(string.digits) for _ in range(len))


def random_password(max_len=PASSWORD_MAX_LEN):
    len = random.randrange(max_len) + 1
    return random_string(len)


def random_phone():
    return random_number_str(PHONE_LEN)


def random_email(max_len=EMAIL_MAX_LEN):
    len = random.randrange(max_len) + 1
    return random_string(len) + '@uwaterloo.ca'


# def random_license_number():
#     return random_number_str(LICENSE_NUMBER_MAX_LEN)


def random_year():
    len = random.randrange(YEAR_MAX_LEN) + 1
    return random_number_str(len)


def random_date():
    d = random.randint(1, 2 * int(datetime.now().timestamp()))
    return datetime.fromtimestamp(d).strftime('%Y-%m-%d')


def random_time():
    d = random.randint(1, 2 * int(datetime.now().timestamp()))
    return datetime.fromtimestamp(d).strftime('%H:%M:%S')


def random_datetime():
    d = random.randint(1, 2 * int(datetime.now().timestamp()))
    return datetime.fromtimestamp(d).strftime('%Y-%m-%d %H:%M:%S')


def random_model():
    model = ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck']
    return random.choice(model)


def random_color():
    color = ['Pearl White Multi-Coat', 'Midnight Silver Metallic', 'Deep Blue Metallic', 'Solid Black',
             'Red Multi-Coat']
    return random.choice(color)


def random_type():
    type = [0, 1]
    return random.choice(type)


def random_user_data():
    return [random_email(), random_password(), 0]


def random_driver_data():
    return [random_email(), random_password(), 1]


def random_user_profile_data(user_count):
    user_email = USER_EMAIL[user_count]
    return [user_email, random.choice(USER_NAME), random_phone()]


def random_driver_profile_data(driver_count):
    driver_email = DRIVER_EMAIL[driver_count]
    return [driver_email, random.choice(DRIVER_NAME), random_phone(), 0]


def random_posting_data():
    if random.randrange(2) == 0:
        return [random.choice(POST_ID), "Toronto", "Waterloo", random_datetime(),
                random.randint(1, 4), random.randrange(100),
                random_string(120)]
    else:
        return [random.choice(POST_ID), "Waterloo", "Toronto", random_datetime(),
                random.randint(1, 4), random.randrange(100),
                random_string(120)]


def random_ride_data():
    return [uuid.uuid4(), random.choice(POST_ID), random.choice(USER_EMAIL)]


def random_provide_carpool_data():
    return [random.choice(DRIVER_EMAIL), uuid.uuid4()]


# need to be modify for number of user
def random_review_data():
    rid = random.choice(RIDE_ID)
    # get corresponding post id
    pid = Ride_Post[rid]
    # get corresponding driver email
    driver_email = Post_Driver[pid]
    return [rid, driver_email, random.randrange(6),
            random_string(150), random_datetime()]


# def random_car_data(driver_id):
#     return [uuid.uuid4(), driver_id, 'Tesla', random_color(),
#             random_model(), random_number_str(2), random_string(8)]


# Populate the user.csv file and return the list of user_id
def populate_user_db():

    with open('user.csv', 'w', newline='') as f:
        writer = csv.writer(f)

        # writer.writerow(USER_DB_HEADER)

        for _ in range(USER_DB_SIZE):
            data = random_user_data()
            USER_EMAIL.append(data[0])
            USER_NAME.append(data[1])
            writer.writerow(data)

        for _ in range(DRIVER_DB_SIZE):
            data = random_driver_data()
            DRIVER_EMAIL.append(data[0])
            DRIVER_NAME.append(data[1])
            writer.writerow(data)

    print('General User database populated success')
    print(str(USER_DB_SIZE + DRIVER_DB_SIZE) + ' rows inserted in file user.csv')

    return


# Populate the user_profile.csv file and return the list of driver_id
def populate_user_profile_db():
    # user_email = []

    with open('user_profile.csv', 'w', newline='') as f:
        writer = csv.writer(f)

        # writer.writerow(USER_DB_HEADER)
        user_count = 0
        for _ in range(USER_DB_SIZE):
            data = random_user_profile_data(user_count)
            user_count += 1
            # driver_id.append(data[0])
            writer.writerow(data)

    print('User Profile database populated success')
    print(str(USER_DB_SIZE) + ' rows inserted in file user_profile.csv')

    return


# Populate the driver_profile.csv file
def populate_driver_profile_db():
    # user_email = []

    with open('driver_profile.csv', 'w', newline='') as f:
        writer = csv.writer(f)

        # writer.writerow(USER_DB_HEADER)
        driver_count = 0
        for _ in range(DRIVER_DB_SIZE):
            data = random_driver_profile_data(driver_count)
            driver_count += 1
            # driver_id.append(data[0])
            writer.writerow(data)

    print('Driver Profile database populated success')
    print(str(DRIVER_DB_SIZE) + ' rows inserted in file driver_profile.csv')

    return


# Populate the provide_post.csv file and add to the list of post_id
def populate_provide_post_db():
    with open('provide_carpool.csv', 'w', newline='') as f:
        writer = csv.writer(f)

        for _ in range(POSTING_DB_SIZE):
            data = random_provide_carpool_data()
            POST_ID.append(data[1])
            # map post id to user email
            Post_Driver[data[1]] = data[0]
            writer.writerow(data)


    print('ProvideCarpool database populated success')
    print(str(POSTING_DB_SIZE) + ' rows inserted in file provide_carpool.csv')


# Populate the posting.csv file
# Each row is depended on provide_carpool(POST_ID)
def populate_posting_db():

    with open('posting.csv', 'w', newline='') as f:
        writer = csv.writer(f)

        # writer.writerow(POSTING_DB_HEADER)

        for _ in range(POSTING_DB_SIZE):
            data = random_posting_data()
            writer.writerow(data)

    print('Posting database populated success')
    print(str(POSTING_DB_SIZE) + ' rows inserted in file posting.csv')

    return


# Populate the ride.csv file and
def populate_ride_db():
    with open('ride.csv', 'w', newline='') as f:
        writer = csv.writer(f)

        # writer.writerow(RIDE_DB_SIZE)

        for _ in range(RIDE_DB_SIZE):
            data = random_ride_data()
            RIDE_ID.append(data[0])
            # map ride id to post id
            Ride_Post[data[0]] = data[1]
            writer.writerow(data)

    print('Ride database populated success')
    print(str(REVIEW_DB_SIZE) + ' rows inserted in file ride.csv')


# Populate the review.csv file
# Each row is dependent on posting(post_id)
def populate_review_db():
    with open('review.csv', 'w', newline='') as f:
        writer = csv.writer(f)

        # writer.writerow(REVIEW_DB_HEADER)

        for _ in range(REVIEW_DB_SIZE):
            data = random_review_data()
            writer.writerow(data)

    print('Review database populated success')
    print(str(REVIEW_DB_SIZE) + ' rows inserted in file review.csv')


def populate_database():
    populate_user_db()
    populate_user_profile_db()
    populate_driver_profile_db()
    populate_provide_post_db()
    populate_posting_db()
    populate_ride_db()
    populate_review_db()

    print('All database populated success')


populate_database()
